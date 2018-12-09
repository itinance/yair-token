pragma solidity 0.4.24;

import "./YairToken.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";


contract InitialArtworkOffering is TimedCrowdsale, MintedCrowdsale {
    constructor(
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _rate,
        address _wallet,
        YairToken _token
    )
    public
        Crowdsale(_rate, _wallet, _token)
        TimedCrowdsale(_openingTime, _closingTime)
    {

    }
}