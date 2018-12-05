const truffleAssert = require('truffle-assertions');
const chai = require('chai');
const should = chai.should();
const assert = chai.assert;



const YairBrandedToken = artifacts.require("YairBrandedToken");

contract('YairBrandedToken', ([_, creator, ...accounts]) => {

  let instance;

  const buyer1 = accounts[0];
  const buyer2 = accounts[1];

  const maxSupply = 1000;
  const initialSupply = 0;

  beforeEach('should setup the contract instance', async () => {
    instance = await YairBrandedToken.new(initialSupply, maxSupply, {from: creator});
  });

  it("Token contract can be deployed and has the right creator", async () => {
    should.exist(instance);
    assert.lengthOf(instance.address, 42);

    assert.equal(await instance.creator(), creator)
    assert.equal(await instance.balanceOf( 0x0 ), 0);
    assert.equal(await instance.balanceOf( creator ), initialSupply);
  });

  it("Can mint token for an artwork", async () => {
    // buyer1 mints 99 token
    await instance.mintTokenForArtworkIdAndSendTo(99, "Artwork1", buyer1, { from: creator });

    assert.equal(await instance.totalSupply(), 99);
    assert.equal(await instance.totalSupplyPerArtwork("Artwork1"), 99);
    assert.equal(await instance.balanceOf(buyer1), 99);
    assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer1), 99);
    assert.equal(await instance.balanceOf(buyer2), 0);
    assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer2), 0);

    assert.equal(await instance.totalSupplyPerArtwork("SECOND"), 0);

    // buyer2 mints 66 token
    await instance.mintTokenForArtworkIdAndSendTo(66, "Artwork1", buyer2, { from: creator });

    assert.equal(await instance.totalSupply(), 99 + 66);
    assert.equal(await instance.totalSupplyPerArtwork("Artwork1"), 99 + 66);
    assert.equal(await instance.totalSupplyPerArtwork("SECOND"), 0);

    assert.equal(await instance.balanceOf(buyer1), 99);
    assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer1), 99);
    assert.equal(await instance.balanceOf(buyer2), 66);
    assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer2), 66);

    // buyer1 mints another 123 token on a second artwork
    await instance.mintTokenForArtworkIdAndSendTo(123, "SECOND", buyer1, { from: creator });

    assert.equal(await instance.totalSupply(), 99 + 66 + 123);
    assert.equal(await instance.totalSupplyPerArtwork("Artwork1"), 99 + 66);
    assert.equal(await instance.totalSupplyPerArtwork("SECOND"), 123);

    assert.equal(await instance.balanceOf(buyer1), 99 + 123);
    assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer1), 99);
    assert.equal(await instance.balancePerArtworkOf("SECOND", buyer1), 123);
    assert.equal(await instance.balanceOf(buyer2), 66);
    assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer2), 66);
    assert.equal(await instance.balancePerArtworkOf("SECOND", buyer2), 0);

  })

  it("Can transfer owned token of an artwork", async () => {
    // buyer1 mints 99 token
    await instance.mintTokenForArtworkIdAndSendTo(99, "Artwork1", buyer1, { from: creator });

    assert.equal(await instance.balanceOf(buyer1), 99);
    assert.equal(await instance.balanceOf(buyer2), 0);

    await instance.transferTokenForArtworkFrom(buyer1, buyer2, "Artwork1", 10);


    assert.equal(await instance.balanceOf(buyer1), 99 - 10);
    assert.equal(await instance.balanceOf(buyer2), 10);
  });

});
