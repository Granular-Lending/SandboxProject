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
        address seller;
        LoanState state;
    }
    Sale[] public sales;
    
    ERC1155 assetContract = ERC1155(0x767c98f260585e9Da36Faef70d1691992BC1addf);
    ERC20 sandToken = ERC20(0xF217FD6336182395B53d9d55881a0D838a6CCc9A);

    constructor() ERC1155TokenReceiver() { }
    
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external override returns(bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }
    
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external override returns(bytes4){       
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }

    function createSale(uint _asset_id, uint _cost, uint _deposit) public {
        require(_cost > _deposit, "Deposit must be less than cost");
        
        sales.push(
            Sale(
            _asset_id,
            _cost, 
            _deposit,
            msg.sender, 
            LoanState.Listed
        ));
        
        assetContract.safeTransferFrom(msg.sender, address(this), _asset_id, 1, "");
    }
    
    function acceptSale(uint _sale_index) public {
        require(sales[_sale_index].state == LoanState.Listed, "Loan must not have been lent yet");
        
        sales[_sale_index].state = LoanState.Borrowed;
        
        sandToken.transferFrom(msg.sender, address(this), sales[_sale_index].cost + sales[_sale_index].deposit);
        assetContract.safeTransferFrom(address(this), msg.sender, sales[_sale_index].asset_id, 1, "");
    }
    
    function returnLoan(uint _sale_index) public {
        require(sales[_sale_index].state == LoanState.Borrowed, "Loan must not have been returned yet");
        //fixme this has to be the person who accepted the loan
        
        sales[_sale_index].state = LoanState.Returned;
        
        sandToken.transfer(msg.sender, sales[_sale_index].deposit);
        assetContract.safeTransferFrom(msg.sender, address(this), sales[_sale_index].asset_id, 1, "");
    }
    
    function collectLoan(uint _sale_index) public {
        require(sales[_sale_index].state == LoanState.Returned, "Loan must not have been collected yet");

        sales[_sale_index].state = LoanState.Collected;
        
        sandToken.transfer(sales[_sale_index].seller, sales[_sale_index].cost - sales[_sale_index].deposit);
        assetContract.safeTransferFrom(address(this), sales[_sale_index].seller, sales[_sale_index].asset_id, 1, "");
    }
    
    function collectLoanFail(uint _sale_index) public {
        require(sales[_sale_index].state == LoanState.Borrowed, "Loan must not have been collected yet");

        sales[_sale_index].state = LoanState.Collected;
        
        sandToken.transfer(sales[_sale_index].seller, sales[_sale_index].cost + sales[_sale_index].deposit);
    }
    
    function getSales() public view returns (uint[100] memory costs, uint[100] memory deposits, uint[100] memory ids, address[100] memory sellers, LoanState[100] memory states) {
        for (uint i=0; i < sales.length; i++){
            costs[i] = sales[i].cost;
        }
        for (uint i=0; i < sales.length; i++){
            deposits[i] = sales[i].deposit;
        }
        for (uint i=0; i < sales.length; i++){
            ids[i] = sales[i].asset_id;
        }
        for (uint i=0; i < sales.length; i++){
            sellers[i] = sales[i].seller;
        }
        for (uint i=0; i < sales.length; i++){
            states[i] = sales[i].state;
        }
        
        return (costs, deposits, ids, sellers, states);
    }
}