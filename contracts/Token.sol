// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Token is ERC20Burnable {
    
    constructor() ERC20("ST","S") {
        _mint(msg.sender, 1000000); 
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function checkBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
    function burn(address sender,uint256 value)  public {
        _burn(sender, value);
    }
}
