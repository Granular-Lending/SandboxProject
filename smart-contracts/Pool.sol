pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";

interface ERC1155TokenReceiver {
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4);
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external returns(bytes4);       
}

contract Pool is ERC1155TokenReceiver {
    struct Sale { 
        uint asset_id;
        uint price; 
        address seller;
        bool sold;
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

    function createSale(uint _asset_id, uint _price) public {
        sales.push(
            Sale(
            _asset_id,
            _price, 
            msg.sender, 
            false
        ));
        
        assetContract.safeTransferFrom(msg.sender, address(this), _asset_id, 1, "");
    }
    
    function acceptSale(uint _sale_index) public {
        require(!sales[_sale_index].sold, "Sale has already been accepted");
        
        sales[_sale_index].sold = true;
        
        sandToken.transferFrom(msg.sender, sales[_sale_index].seller, sales[_sale_index].price );
        assetContract.safeTransferFrom(address(this), msg.sender, sales[_sale_index].asset_id, 1, "");
    }
    
    function getSales() public view returns (uint[100] memory prices, uint[100] memory ids, address[100] memory sellers, bool[100] memory solds) {
        for (uint i=0; i < sales.length; i++){
            prices[i] = sales[i].price;
        }
        for (uint i=0; i < sales.length; i++){
            ids[i] = sales[i].asset_id;
        }
        for (uint i=0; i < sales.length; i++){
            sellers[i] = sales[i].seller;
        }
        for (uint i=0; i < sales.length; i++){
            solds[i] = sales[i].sold;
        }
        
        return (prices, ids, sellers, solds);
    }
}