pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract YairToken is ERC20, ERC20Detailed, ERC20Capped {
    using SafeMath for uint256;

    // The address of the contract creator
    address internal _creator;

    /**
     * @dev Constructor with a hard cap
     */
    constructor(uint256 maxSupply, uint256 initialSupply) public
        ERC20Detailed("Yair Token", "YAI", 18)
        ERC20Capped(maxSupply)
    {
        require(msg.sender != address(0));

        _creator = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Returns the creator of the contract
     */
    function creator() external view returns (address) {
        return _creator;
    }

}

