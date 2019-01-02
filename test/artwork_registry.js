const truffleAssert = require('truffle-assertions');

const ArtworkRegistry = artifacts.require("ArtworkRegistry");

contract('ArtworkRegistry', ([_, creator, ...accounts]) => {

    let registry;

    return;

    beforeEach('should setup the contract instance', async () => {
        registry = await ArtworkRegistry.new({from: creator});
    });

    it("Unregistered Artwork is detected as unregistered", async () => {
        assert.isFalse( await registry.isArtworkRegistered("Artwork 1") );
    });

    it("Registering artwork works as expected ", async () => {
        const tx = await registry.registerArtwork("Artwork 1", "The Sun", "Satoshi Nakamoto", {from: creator});

        truffleAssert.eventEmitted(tx, 'ArtworkWasRegistered', (ev) => {
            return web3.toUtf8(ev.artworkId) == "Artwork 1" && ev.title == "The Sun";
        });

        assert.isTrue( await registry.isArtworkRegistered("Artwork 1") );
    });

    it("Registering artwork twice should fail", async () => {
        await registry.registerArtwork("Artwork 1", "The Sun", "Satoshi Nakamoto", {from: creator});

        await truffleAssert.reverts(registry.registerArtwork("Artwork 1", "The Sun", "Satoshi Nakamoto", {from: creator}));
    });

});
