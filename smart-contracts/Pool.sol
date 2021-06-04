pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";

interface ERC1155TokenReceiver {
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4);
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external returns(bytes4);       
}

contract Pool is ERC1155TokenReceiver {
    enum LoanState { Listed, Borrowed, Collected }

    struct Loan { 
        uint asset_id;
        uint cost; 
        uint deposit; 
        uint duration;
        uint startTime;
        address loaner;
        address loanee;
        LoanState state;
    }
    Loan[] public loans;
    
    ERC20 sandToken = ERC20(0xFab46E002BbF0b4509813474841E0716E6730136);
    ERC1155 assetContract = ERC1155(0x2138A58561F66Be7247Bb24f07B1f17f381ACCf8);

    constructor() ERC1155TokenReceiver() { }
    
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external override returns(bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }
    
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external override returns(bytes4){       
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }

    function createLoan(uint _asset_id, uint _cost, uint _deposit, uint _duration) public {
        loans.push(
            Loan(
            _asset_id,
            _cost, 
            _deposit,
            _duration,
            0,
            msg.sender, 
            address(0), 
            LoanState.Listed
        ));
        
        assetContract.safeTransferFrom(msg.sender, address(this), _asset_id, 1, "");
    }
    
    function acceptLoan(uint _sale_index) public {
        require(loans[_sale_index].state == LoanState.Listed, "Loan must not have been lent yet");
        
        loans[_sale_index].state = LoanState.Borrowed;
        loans[_sale_index].startTime = block.timestamp;
        loans[_sale_index].loanee = msg.sender;
        
        sandToken.transferFrom(msg.sender, loans[_sale_index].loaner, loans[_sale_index].cost);
        sandToken.transferFrom(msg.sender, address(this), loans[_sale_index].deposit);
        assetContract.safeTransferFrom(address(this), msg.sender, loans[_sale_index].asset_id, 1, "");
    }
    
    function returnLoan(uint _sale_index) public {
        require(loans[_sale_index].state == LoanState.Borrowed, "Loan must not have been returned yet");

        loans[_sale_index].state = LoanState.Collected;
        
        sandToken.transfer(loans[_sale_index].loanee, loans[_sale_index].deposit);
        assetContract.safeTransferFrom(loans[_sale_index].loanee, loans[_sale_index].loaner, loans[_sale_index].asset_id, 1, "");
    }
    
    function timeoutLoan(uint _sale_index) public {
        require(loans[_sale_index].state == LoanState.Borrowed, "Loan must not have been collected yet");
        require(block.timestamp > loans[_sale_index].startTime + loans[_sale_index].duration, "Loan duration has not passed");

        loans[_sale_index].state = LoanState.Collected;
        
        sandToken.transfer(loans[_sale_index].loaner, loans[_sale_index].deposit);
    }
    
    function getLoans() public view returns (uint[100] memory costs, uint[100] memory deposits, uint[100] memory durations, uint[100] memory startTimes, uint[100] memory ids, address[100] memory loaners, address[100] memory loanees, LoanState[100] memory states) {
        for (uint i=0; i < loans.length; i++){
            costs[i] = loans[i].cost;
        }
        for (uint i=0; i < loans.length; i++){
            deposits[i] = loans[i].deposit;
        }
        for (uint i=0; i < loans.length; i++){
            durations[i] = loans[i].duration;
        }
        for (uint i=0; i < loans.length; i++){
            startTimes[i] = loans[i].startTime;
        }
        for (uint i=0; i < loans.length; i++){
            ids[i] = loans[i].asset_id;
        }
        for (uint i=0; i < loans.length; i++){
            loaners[i] = loans[i].loaner;
        }
        for (uint i=0; i < loans.length; i++){
            loanees[i] = loans[i].loanee;
        }
        for (uint i=0; i < loans.length; i++){
            states[i] = loans[i].state;
        }
        
        return (costs, deposits, durations, startTimes, ids, loaners, loanees, states);
    }
}