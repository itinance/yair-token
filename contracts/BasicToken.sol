pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract BasicToken is ERC20Mintable, ERC20Detailed /*, ERC165 */ {
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals()));

    constructor() public
        ERC20Detailed("Yair Branded Token", "YAT", 18)
    {
        require(msg.sender != address(0));

        //_mint(msg.sender, INITIAL_SUPPLY);
    }

}