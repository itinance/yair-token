const truffleAssert = require('truffle-assertions');
const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const BigNumber = web3.BigNumber;

// Helpers
const { ether } = require('./helpers/ether');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_UINT256 = new BigNumber(2).pow(256).minus(1);

// Contracts to test
const YairToken = artifacts.require("YairToken");
const YairTokenSale = artifacts.require("YairTokenSale");



contract('YairTokenSale', ([_, creator, ...accounts]) => {

  const buyer1 = accounts[0];
  const buyer2 = accounts[1];

  const maxSupply = 1000;
  const initialSupply = 0;

  const openingTime = web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
  const closingTime = openingTime + 86400 * 30; // 30 days
  const rate = new web3.BigNumber(1000);
  const wallet = creator;

  it('requires a non-null token', async () => {
    await truffleAssert.reverts (
      YairTokenSale.new(openingTime, closingTime, rate, wallet, ZERO_ADDRESS, {from: creator})
    );
  });

  context('with token', async () => {

    let sale
      , token;

    beforeEach('setup the contract instance', async () => {
      token = await YairToken.new(initialSupply, maxSupply, {from: creator});
    });

    it('requires a non-zero rate', async () => {
      await truffleAssert.reverts (
        YairTokenSale.new(openingTime, closingTime, 0, wallet, token.address, {from: creator})
      );
    });

    it('requires a non-null wallet', async () => {
      await truffleAssert.reverts (
        YairTokenSale.new(openingTime, closingTime, rate, ZERO_ADDRESS, token.address, {from: creator})
      );
    });

    context('Once deployed', async () => {
      beforeEach(async function () {
        sale = await YairTokenSale.new(openingTime, closingTime, rate, wallet, token.address, {from: creator});
      });


      it("Sale Contract should accept Ether", async () => {
        await sale.send( ether(42), {from: buyer1})
      });

    });

  });

});


// sale = await YairTokenSale.new(openingTime, closingTime, rate, wallet, token.address, {from: creator});