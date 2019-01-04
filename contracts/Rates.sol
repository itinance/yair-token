pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Rates {

    uint256 private _openingTime;

    constructor(uint256 openingTime) public
    {
        require(msg.sender != address(0));
    }

}