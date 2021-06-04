pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";

interface ERC1155TokenReceiver {
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4);
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external returns(bytes4);       
}

contract Pool is ERC1155TokenReceiver {
    enum LoanState { Listed, Borrowed, Returned, Collected }

    struct Sale { 
        uint asset_id;
        uint cost; 
        uint deposit; 
        uint duration;
        uint startTime;
        address loaner;
        address loanee;
        LoanState state;
    }
    Sale[] public sales;
    
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
        require(_cost > _deposit, "Deposit must be less than cost");
        
        sales.push(
            Sale(
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
        require(sales[_sale_index].state == LoanState.Listed, "Loan must not have been lent yet");
        
        sales[_sale_index].state = LoanState.Borrowed;
        sales[_sale_index].startTime = block.timestamp;
        sales[_sale_index].loanee = msg.sender;
        
        sandToken.transferFrom(msg.sender, address(this), sales[_sale_index].cost + sales[_sale_index].deposit);
        assetContract.safeTransferFrom(address(this), msg.sender, sales[_sale_index].asset_id, 1, "");
    }
    
    function returnLoan(uint _sale_index) public {
        require(sales[_sale_index].state == LoanState.Borrowed, "Loan must not have been returned yet");

        sales[_sale_index].state = LoanState.Returned;
        
        sandToken.transfer(sales[_sale_index].loanee, sales[_sale_index].deposit);
        assetContract.safeTransferFrom(sales[_sale_index].loanee, address(this), sales[_sale_index].asset_id, 1, "");
    }
    
    function collectLoan(uint _sale_index) public {
        require(sales[_sale_index].state == LoanState.Returned, "Loan must not have been collected yet");

        sales[_sale_index].state = LoanState.Collected;
        
        sandToken.transfer(sales[_sale_index].loaner, sales[_sale_index].cost - sales[_sale_index].deposit);
        assetContract.safeTransferFrom(address(this), sales[_sale_index].loaner, sales[_sale_index].asset_id, 1, "");
    }
    
    function collectLoanFail(uint _sale_index) public {
        require(sales[_sale_index].state == LoanState.Borrowed, "Loan must not have been collected yet");
        require(block.timestamp > sales[_sale_index].startTime + sales[_sale_index].duration, "Loan duration has not passed");

        sales[_sale_index].state = LoanState.Collected;
        
        sandToken.transfer(sales[_sale_index].loaner, sales[_sale_index].cost + sales[_sale_index].deposit);
    }
    
    function getSales() public view returns (uint[100] memory costs, uint[100] memory deposits, uint[100] memory durations, uint[100] memory startTimes, uint[100] memory ids, address[100] memory loaners, address[100] memory loanees, LoanState[100] memory states) {
        for (uint i=0; i < sales.length; i++){
            costs[i] = sales[i].cost;
        }
        for (uint i=0; i < sales.length; i++){
            deposits[i] = sales[i].deposit;
        }
        for (uint i=0; i < sales.length; i++){
            durations[i] = sales[i].duration;
        }
        for (uint i=0; i < sales.length; i++){
            startTimes[i] = sales[i].startTime;
        }
        for (uint i=0; i < sales.length; i++){
            ids[i] = sales[i].asset_id;
        }
        for (uint i=0; i < sales.length; i++){
            loaners[i] = sales[i].loaner;
        }
        for (uint i=0; i < sales.length; i++){
            loanees[i] = sales[i].loanee;
        }
        for (uint i=0; i < sales.length; i++){
            states[i] = sales[i].state;
        }
        
        return (costs, deposits, durations, startTimes, ids, loaners, loanees, states);
    }
}