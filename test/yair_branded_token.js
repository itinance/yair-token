const truffleAssert = require('truffle-assertions');
const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const YairBrandedToken = artifacts.require("YairBrandedToken");

contract('YairBrandedToken', ([_, creator, ...accounts]) => {

  let instance;

  beforeEach('should setup the contract instance', async () => {
    instance = await YairBrandedToken.new(0, 1000, {from: creator});

    console.log(-1, creator);
    console.log(-2, await instance.getCreator());
  });

  it("Token contract can be deployed and has the right creator", async () => {
    should.exist(instance);
    assert.lengthOf(instance.address, 42);

    assert.equal(await instance.getCreator(), creator)
    assert.equal(await instance.balanceOf(0x0), 0);
  });

  it("Can mint token for an artwork", async () => {

    const minter = accounts[0];
    console.log(1, minter);
    console.log(2, creator);

    console.log(3, await instance.test());

    return;

    await instance.mintTokenForArtworkId(100, "Artwork1", { from: creator });

    assert.equal(await instance.balanceOf(0x0), 0);
  })
});
