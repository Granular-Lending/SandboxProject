pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

/// @title ASSET Lending Pool
/// @author Fraser Scott
contract Pool is ERC1155Receiver {
    enum LoanState { Listed, Borrowed, Collected }
    
    struct Loan { 
        uint assetID;
        uint cost; 
        uint deposit; 
        uint duration;
        uint entry;
        uint startTime;
        address loaner;
        address borrower;
        LoanState state;
    }
    
    address public constant ERC20_ADDRESS = 0xFab46E002BbF0b4509813474841E0716E6730136;
    address public constant ERC1155_ADDRESS = 0x2138A58561F66Be7247Bb24f07B1f17f381ACCf8;
    
    ERC20 private sandToken = ERC20(ERC20_ADDRESS);
    ERC1155 private assetContract = ERC1155(ERC1155_ADDRESS);
    Loan[] public loans;

    constructor() ERC1155Receiver() { }
    
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external override returns(bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }
    
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external override returns(bytes4){       
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }

    /// @notice Put an ASSET into the lending pool.
    /// @param _assetID The Sandbox asset ID.
    function createLoan(uint _assetID, uint _cost, uint _deposit, uint _duration) public {
        loans.push(
            Loan(
            _assetID,
            _cost, 
            _deposit,
            _duration,
            block.timestamp,
            0,
            msg.sender, 
            address(0), 
            LoanState.Listed
        ));
        
        assetContract.safeTransferFrom(msg.sender, address(this), _assetID, 1, "");
    }
    
    /// @notice Accept a loan, take an ASSET out of the pool.
    /// @param _loanIndex The index in the loan array.
    function acceptLoan(uint _loanIndex) public {
        require(loans[_loanIndex].state == LoanState.Listed, "This ASSET is not in the pool");
        require(block.timestamp < loans[_loanIndex].entry + loans[_loanIndex].duration, "Loan duration has passed");
        
        loans[_loanIndex].state = LoanState.Borrowed;
        loans[_loanIndex].startTime = block.timestamp;
        loans[_loanIndex].borrower = msg.sender;
        
        sandToken.transferFrom(loans[_loanIndex].borrower, address(this), loans[_loanIndex].deposit);
        assetContract.safeTransferFrom(address(this), msg.sender, loans[_loanIndex].assetID, 1, "");
    }
    
    /// @notice Return a loan, put an ASSET back into the pool.
    /// @param _loanIndex The index in the loan array.
    function returnLoan(uint _loanIndex) public {
        require(msg.sender == loans[_loanIndex].borrower, "You are not the borrower");
        require(loans[_loanIndex].state == LoanState.Borrowed, "This ASSET is not currently borrowed");

        loans[_loanIndex].state = LoanState.Listed;

        sandToken.transfer(loans[_loanIndex].borrower, loans[_loanIndex].deposit);
        sandToken.transferFrom(loans[_loanIndex].borrower, loans[_loanIndex].loaner, loans[_loanIndex].cost * (block.timestamp - loans[_loanIndex].startTime));
        
        assetContract.safeTransferFrom(loans[_loanIndex].borrower, address(this), loans[_loanIndex].assetID, 1, "");
    }
    
    /// @notice Collect ASSET from the pool.
    /// @param _loanIndex The index in the loan array.
    function collectLoan(uint _loanIndex) public {
        require(msg.sender == loans[_loanIndex].loaner, "You are not the loaner");
        require(loans[_loanIndex].state == LoanState.Listed, "This ASSET is not in the pool");

        loans[_loanIndex].state = LoanState.Collected;
        
        assetContract.safeTransferFrom(address(this), loans[_loanIndex].loaner, loans[_loanIndex].assetID, 1, "");
    }
    
    /// @notice Loaner takes borrowers deposit if they failed to return the ASSET.
    /// @param _loanIndex The index in the loan array.
    function timeoutLoan(uint _loanIndex) public {
        require(msg.sender == loans[_loanIndex].loaner);
        require(loans[_loanIndex].state == LoanState.Borrowed, "This ASSET is not currently borrowed");
        require(block.timestamp > loans[_loanIndex].entry + loans[_loanIndex].duration, "Loan duration has not passed");

        loans[_loanIndex].state = LoanState.Collected;
        
        sandToken.transfer(loans[_loanIndex].loaner, loans[_loanIndex].deposit);
    }
    
    /// @notice Returns every loan.
    /// @dev Data is flattened to be more easily read on the frontend.
    function getLoans() public view returns (uint[] memory costs, uint[] memory deposits, uint[] memory durations, uint[] memory startTimes, uint[] memory entrys, uint[] memory ids, address[] memory loaners, address[] memory borrowers, LoanState[] memory states) {
        costs = new uint[](loans.length);
        deposits = new uint[](loans.length);
        durations = new uint[](loans.length);
        startTimes = new uint[](loans.length);
        entrys = new uint[](loans.length);
        ids = new uint[](loans.length);
        loaners = new address[](loans.length);
        borrowers = new address[](loans.length);
        states = new LoanState[](loans.length);
        
        for (uint i=0; i < loans.length; i++){
            costs[i] = loans[i].cost;
            deposits[i] = loans[i].deposit;
            durations[i] = loans[i].duration;
            entrys[i] = loans[i].entry;
            startTimes[i] = loans[i].startTime;
            ids[i] = loans[i].assetID;
            loaners[i] = loans[i].loaner;
            borrowers[i] = loans[i].borrower;
            states[i] = loans[i].state;
        }
    }
}