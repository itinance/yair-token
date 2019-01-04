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


const DECIMALS = 18;
const DECIMAL_FACTOR = new BigNumber(10).pow(DECIMALS);

function convertToToken( amount ) {
  return new BigNumber(amount).div(DECIMAL_FACTOR);
}

contract('YairTokenSale', ([_, creator, ...accounts]) => {

  const buyer1 = accounts[0];
  const buyer2 = accounts[1];

  const maxSupply = 1000;
  const initialSupply = 0;

  const openingTime = web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
  const closingTime = openingTime + 86400 * 30; // 30 days
  const wallet = creator;

  it('requires a non-null token', async () => {
    await truffleAssert.reverts (
      YairTokenSale.new(openingTime, closingTime, wallet, ZERO_ADDRESS, {from: creator})
    );
  });

  context('with token', async () => {

    let sale
      , token;

    beforeEach('setup the contract instance', async () => {
      token = await YairToken.new(initialSupply, maxSupply, {from: creator});
    });

    it('requires a non-null wallet', async () => {
      await truffleAssert.reverts (
        YairTokenSale.new(openingTime, closingTime, ZERO_ADDRESS, token.address, {from: creator})
      );
    });

    context('Once deployed', async () => {
      beforeEach(async function () {
        sale = await YairTokenSale.new(openingTime, closingTime, wallet, token.address, {from: creator});

        await token.addMinter(sale.address, {from: creator});
      });

      it("Sale Contract should accept Ether", async () => {
        await sale.send( ether(0.234), {from: buyer1})
        const value = ether(0.012345);
        await sale.buyTokens(buyer1, { value: value, from: creator} );
      });

      it("Buying token", async () => {
        const rate = await sale.getCurrentRate();

        const value = ether(1); // 1 ETH == 100 Token
        const tokenAmount = value * rate;

        let tx = await sale.buyTokens(buyer1, { value: value, from: creator} );
        truffleAssert.eventEmitted(tx, 'TokensPurchased', (ev) => {
          return ev.beneficiary === buyer1 && ev.amount == value * rate;
        });

        assert.equal(convertToToken(await token.totalSupply()), 100);

        assert.equal( await token.balanceOf(buyer1), tokenAmount);
        assert.equal( await token.totalSupply(), tokenAmount);

        tx = await sale.buyTokens(buyer2, { value: value / 2, from: creator} );
        truffleAssert.eventEmitted(tx, 'TokensPurchased', (ev) => {
          return ev.beneficiary === buyer2 && ev.amount == value /2  * rate;
        });

        assert.equal( await token.balanceOf(buyer2), tokenAmount / 2);
        assert.equal( await token.balanceOf(buyer1), tokenAmount);
        assert.equal( await token.totalSupply(), tokenAmount + tokenAmount / 2);
      });
    });
  });

});