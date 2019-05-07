const truffleAssert = require('truffle-assertions');
const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const web3 = require('web3');

const BigNumber = web3.utils.BN;

// Helpers
const { ether } = require('./helpers/ether');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_UINT256 = new BigNumber(2).pow(256).minus(1);

// Contracts to test
const YairToken = artifacts.require("YairToken");
const YairTokenSale = artifacts.require("YairTokenSale");


const DECIMALS = 18;
const DECIMAL_FACTOR = new BigNumber(10).pow(DECIMALS);

function convertToToken( amount ) {
  return new BigNumber(amount).div(DECIMAL_FACTOR);
}

contract('YairTokenBranding', ([_, creator, ...accounts]) => {

  const buyer1 = accounts[0];
  const buyer2 = accounts[1];

  const maxSupply = 1000;
  const initialSupply = 0;

  console.log('web3',web3);
  return;
  const openingTime = (await web3.eth.getBlock('latest')).timestamp + 2; // two secs in the future
  const closingTime = openingTime + 86400 * 30; // 30 days
  const wallet = creator;

  let sale
    , token;

  beforeEach('setup the contract instance', async () => {
    token = await YairToken.new(initialSupply, maxSupply, {from: creator});
    sale = await YairTokenSale.new(openingTime, closingTime, wallet, token.address, {from: creator});
    await token.addMinter(sale.address, {from: creator});
  });

  context('With 2 buyers that holds already Yair Token', async () => {

    beforeEach('setup the contract instance', async () => {
      await sale.buyTokens(buyer1, { value: ether(1), from: creator} );
      await sale.buyTokens(buyer1, { value: ether(2), from: creator} );
    });

    context('Precommit phase', async () => {


    });

  });

});


// sale = await YairTokenSale.new(openingTime, closingTime, rate, wallet, token.address, {from: creator});