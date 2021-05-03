// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";

contract GameItems is ERC1155 {
    uint256 public constant UNICORN = 26059276970032186212506257052788207833935590993847855924189730778752558827520;
    uint256 public constant HEAVENLY_SWORD = 40785833732304342849735419653626615027421227776496020677721887159020450484224;

    constructor() public ERC1155("FIXME") {
        _mint(msg.sender, UNICORN, 10**18, "");
        _mint(msg.sender, HEAVENLY_SWORD, 10**18, "");

    }
}