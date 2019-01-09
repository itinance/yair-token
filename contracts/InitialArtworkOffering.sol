pragma solidity 0.5.0;

import "./YairToken.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";


contract InitialArtworkOffering is TimedCrowdsale, MintedCrowdsale {
    constructor(
        uint256 openingTime,
        uint256 closingTime,
        uint256 rate,
        address payable wallet,
        YairToken token
    )
    public
        Crowdsale(rate, wallet, token)
        TimedCrowdsale(openingTime, closingTime)
    {

    }
}