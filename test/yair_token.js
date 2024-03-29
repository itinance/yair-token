const truffleAssert = require('truffle-assertions');

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const YairToken = artifacts.require("YairToken");

contract('YairToken', ([_, creator, ...accounts]) => {

  let instance;

  const buyer1 = accounts[0];
  const buyer2 = accounts[1];

  const maxSupply = 1000;
  const initialSupply = 0;

  beforeEach('setup the contract instance', async () => {
    instance = await YairToken.new(initialSupply, maxSupply, {from: creator});
  });

  describe('ArtworkRegistry without Automation', () => {

    it("Can't mint token on unregistered Artworks", async () => {
      await truffleAssert.reverts (instance.mintTokenForArtworkIdAndSendTo(99, "Artwork1", buyer1, { from: creator }) );
    });

  })


  describe('ArtworkRegistry automatically used', () => {

    beforeEach('register artworks for testing ', async () => {
      await instance.registerArtwork("Artwork1", "Artwork 1", "Satoshi Nakamoto", {from: creator});
      await instance.registerArtwork("SECOND", "Artwork 1", "Satoshi Nakamoto", {from: creator});
    });

    it("Token contract can be deployed", async () => {
      should.exist(instance);
      assert.lengthOf(instance.address, 42);
    });

    it("Can mint token for an artwork", async () => {
      // buyer1 mints 99 token
      let tx = await instance.mintTokenForArtworkIdAndSendTo(99, "Artwork1", buyer1, { from: creator });

      truffleAssert.eventEmitted(tx, 'TransferDetailled', (ev) => {
        return web3.toUtf8(ev.artworkId) === "Artwork1" && ev.count == 99
          && ev.from == 0x0 && ev.to === buyer1;
      });

      assert.equal(await instance.totalSupply(), 99);
      assert.equal(await instance.totalSupplyPerArtwork("Artwork1"), 99);
      assert.equal(await instance.balanceOf(buyer1), 99);
      assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer1), 99);
      assert.equal(await instance.balanceOf(buyer2), 0);
      assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer2), 0);

      assert.equal(await instance.totalSupplyPerArtwork("SECOND"), 0);

      // buyer2 mints 66 token
      tx = await instance.mintTokenForArtworkIdAndSendTo(66, "Artwork1", buyer2, { from: creator });

      truffleAssert.eventEmitted(tx, 'TransferDetailled', (ev) => {
        return web3.toUtf8(ev.artworkId) === "Artwork1" && ev.count == 66
          && ev.from == 0x0 && ev.to === buyer2;
      });

      assert.equal(await instance.totalSupply(), 99 + 66);
      assert.equal(await instance.totalSupplyPerArtwork("Artwork1"), 99 + 66);
      assert.equal(await instance.totalSupplyPerArtwork("SECOND"), 0);

      assert.equal(await instance.balanceOf(buyer1), 99);
      assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer1), 99);
      assert.equal(await instance.balanceOf(buyer2), 66);
      assert.equal(await instance.balancePerArtworkOf("Artwork1", buyer2), 66);

      // buyer1 mints another 123 token on a second artwork
      tx = await instance.mintTokenForArtworkIdAndSendTo(123, "SECOND", buyer1, { from: creator });

      truffleAssert.eventEmitted(tx, 'TransferDetailled', (ev) => {
        return web3.toUtf8(ev.artworkId) === "SECOND" && ev.count == 123
          && ev.from == 0x0 && ev.to === buyer1;
      });


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

    /*it("Can transfer owned token of an artwork", async () => {
      // buyer1 mints 99 token
      let tx = await instance.mintTokenForArtworkIdAndSendTo(99, "Artwork1", buyer1, { from: creator });

      truffleAssert.eventEmitted(tx, 'TransferDetailled', (ev) => {
        return web3.toUtf8(ev.artworkId) === "Artwork1" && ev.count == 99
          && ev.from == 0x0 && ev.to === buyer1;
      });

      assert.equal(await instance.balanceOf(buyer1), 99);
      assert.equal(await instance.balanceOf(buyer2), 0);

      tx = await instance.transferTokenForArtworkFrom(buyer1, buyer2, "Artwork1", 10);

      truffleAssert.eventEmitted(tx, 'TransferDetailled', (ev) => {
        return web3.toUtf8(ev.artworkId) === "Artwork1" && ev.count == 10
          && ev.from === buyer1 && ev.to === buyer2;
      });

      assert.equal(await instance.balanceOf(buyer1), 99 - 10);
      assert.equal(await instance.balanceOf(buyer2), 10);
    });*/

    it("Can't transfer more token of an artwork as a buyer currently holds", async () => {
      // buyer1 mints 99 token
      const tx = await instance.mintTokenForArtworkIdAndSendTo(99, "Artwork1", buyer1, { from: creator });

      truffleAssert.eventEmitted(tx, 'TransferDetailled', (ev) => {
        return web3.toUtf8(ev.artworkId) === "Artwork1" && ev.count == 99
          && ev.from == 0x0 && ev.to === buyer1;
      });

      // buyer1 want to transfer more token than he holds
      // we expect a revert()
      await truffleAssert.reverts (instance.transferTokenForArtworkFrom(buyer1, buyer2, "Artwork1", 100));
    });

    it("can't transfer token of an artwork that do i not have", async () => {
      // we expect a revert()
      await truffleAssert.reverts (instance.transferTokenForArtworkFrom(buyer1, buyer2, "Artwork1", 10));
    });

    it("external transfer method will revert on invalid humbers", async () => {
      // we expect a revert()
      await truffleAssert.reverts (instance.transferTokenForArtworkFrom(buyer1, buyer2, "Artwork1", -1));
      await truffleAssert.reverts (instance.transferTokenForArtworkFrom(buyer1, buyer2, "Artwork1", 0));
    });

    it("external transfer method will revert on invalid addresses", async () => {
      // buyer1 mints 99 token
      await instance.mintTokenForArtworkIdAndSendTo(99, "Artwork1", buyer1, { from: creator });

      // we expect a revert()
      await truffleAssert.reverts (instance.transferTokenForArtworkFrom(0x0, buyer2, "Artwork1", 10));
      await truffleAssert.reverts (instance.transferTokenForArtworkFrom(buyer1, 0x0, "Artwork1", 10));
      await truffleAssert.reverts (instance.transferTokenForArtworkFrom(0x0, 0x0, "Artwork1", 10));
    });

  })

});
