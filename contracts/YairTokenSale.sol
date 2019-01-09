pragma solidity 0.5.0;

import "./YairToken.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";


contract YairTokenSale is /*TimedCrowdsale,*/ MintedCrowdsale {

    constructor(
        uint256 openingTime,
        uint256 closingTime,
        address payable wallet,
        YairToken token
    )
    public
        // use 1 as a fake rate
        Crowdsale(1, wallet, token)
        //TimedCrowdsale(_openingTime, _closingTime)
    {
    }

    /**
     * @return the number of token units a buyer gets per wei.
     */
    function rate() public view returns (uint256) {
        revert();
    }

    /**
     * In preparation for growing token prices depending on time ranges
     */
    function getCurrentRate() public view returns (uint256) {
        return 100;
    }

    /**
     * @dev Override to extend the way in which ether is converted to tokens.
     * @param weiAmount Value in wei to be converted into tokens
     * @return Number of tokens that can be purchased with the specified _weiAmount
     */
    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        uint256 _rate = getCurrentRate();
        return weiAmount.mul(_rate);
    }


}