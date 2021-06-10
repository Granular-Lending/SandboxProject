pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";

interface ERC1155TokenReceiver {
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4);
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external returns(bytes4);       
}

/// @title ASSET Lending Pool
/// @author Fraser Scott
contract Pool is ERC1155TokenReceiver {
    enum LoanState { Listed, Borrowed, Collected }
    struct Loan { 
        uint assetID;
        uint cost; 
        uint deposit; 
        uint duration;
        uint entry;
        uint startTime;
        address loaner;
        address loanee;
        LoanState state;
    }
    
    Loan[] public loans;
    
    address public ERC20_ADDRESS = 0xFab46E002BbF0b4509813474841E0716E6730136;
    address public ERC1155_ADDRESS = 0x2138A58561F66Be7247Bb24f07B1f17f381ACCf8;
    
    ERC20 private sandToken = ERC20(ERC20_ADDRESS);
    ERC1155 private assetContract = ERC1155(ERC1155_ADDRESS);

    constructor() ERC1155TokenReceiver() { }
    
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external override returns(bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }
    
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external override returns(bytes4){       
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }

    /// @notice Put an ASSET into the pool
    /// @param _assetID yada
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
    
    /// @notice Accept a loan, take an ASSET out of the pool
    /// @param _loanIndex yada
    function acceptLoan(uint _loanIndex) public {
        require(loans[_loanIndex].state == LoanState.Listed, "This ASSET is not in the pool");
        require(block.timestamp < loans[_loanIndex].entry + loans[_loanIndex].duration, "Loan duration must not have passed");
        
        loans[_loanIndex].state = LoanState.Borrowed;
        loans[_loanIndex].startTime = block.timestamp;
        loans[_loanIndex].loanee = msg.sender;
        
        sandToken.transferFrom(loans[_loanIndex].loanee, address(this), loans[_loanIndex].deposit);
        assetContract.safeTransferFrom(address(this), msg.sender, loans[_loanIndex].assetID, 1, "");
    }
    
    /// @notice Return a loan, put an ASSET back into the pool
    /// @param _loanIndex yada
    function returnLoan(uint _loanIndex) public {
        require(msg.sender == loans[_loanIndex].loanee, "You are not the borrower");
        require(loans[_loanIndex].state == LoanState.Borrowed, "This ASSET is not currently borrowed");

        loans[_loanIndex].state = LoanState.Listed;

        uint fee = loans[_loanIndex].cost * (block.timestamp - loans[_loanIndex].startTime);
        
        sandToken.transfer(loans[_loanIndex].loanee, loans[_loanIndex].deposit);
        sandToken.transferFrom(loans[_loanIndex].loanee, loans[_loanIndex].loaner, fee);
        
        assetContract.safeTransferFrom(loans[_loanIndex].loanee, address(this), loans[_loanIndex].assetID, 1, "");
    }
    
    /// @notice Collect ASSET from the pool
    /// @param _loanIndex yada
    function collectLoan(uint _loanIndex) public {
        require(msg.sender == loans[_loanIndex].loaner, "You are not the loaner");
        require(loans[_loanIndex].state == LoanState.Listed, "This ASSET is not in the pool");

        loans[_loanIndex].state = LoanState.Collected;
        
        assetContract.safeTransferFrom(address(this), loans[_loanIndex].loaner, loans[_loanIndex].assetID, 1, "");
    }
    
    /// @notice Take the deposit if the borrower failed to return it
    /// @param _loanIndex yada
    function timeoutLoan(uint _loanIndex) public {
        require(msg.sender == loans[_loanIndex].loaner);
        require(loans[_loanIndex].state == LoanState.Borrowed, "This ASSET is not currently borrowed");
        require(block.timestamp > loans[_loanIndex].entry + loans[_loanIndex].duration, "Loan duration has not passed");

        loans[_loanIndex].state = LoanState.Collected;
        
        sandToken.transfer(loans[_loanIndex].loaner, loans[_loanIndex].deposit);
    }
    
    /// @notice Returns the loans in range [_startIndex, _startIndex + 100)
    /// @dev Data is flattened to be read by Javascript
    function getLoans() public view returns (uint[100] memory costs, uint[100] memory deposits, uint[100] memory durations, uint[100] memory startTimes, uint[100] memory entrys, uint[100] memory ids, address[100] memory loaners, address[100] memory loanees, LoanState[100] memory states) {
        uint _startIndex = 0; // TODO make me a parametery
        require(_startIndex < loans.length, "Index must be in array");
        
        for (uint i=_startIndex; i < loans.length && i < _startIndex + 100; i++){
            costs[i] = loans[i].cost;
            deposits[i] = loans[i].deposit;
            durations[i] = loans[i].duration;
            entrys[i] = loans[i].entry;
            startTimes[i] = loans[i].startTime;
            ids[i] = loans[i].assetID;
            loaners[i] = loans[i].loaner;
            loanees[i] = loans[i].loanee;
            states[i] = loans[i].state;
        }
        
        return (costs, deposits, durations, startTimes, entrys, ids, loaners, loanees, states);
    }
}