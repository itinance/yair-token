const truffleAssert = require('truffle-assertions');

const ArtworkRegistry = artifacts.require("ArtworkRegistry");

contract('ArtworkRegistry', ([_, creator, ...accounts]) => {

    let registry;

    beforeEach('should setup the contract instance', async () => {
        registry = await ArtworkRegistry.new({from: creator});
    });

    it("Unregistered Artwork is detected as unregistered", async () => {
        assert.isFalse( await registry.isArtworkRegistered("Artwork 1") );
    });

    it("Registering artwork works as expected ", async () => {
        await registry.registerArtwork("Artwork 1", "The Sun", "Satoshi Nakamoto");
        assert.isTrue( await registry.isArtworkRegistered("Artwork 1") );
    });

    it("Registering artwork twice should fail", async () => {
        await registry.registerArtwork("Artwork 1", "The Sun", "Satoshi Nakamoto");

        await truffleAssert.reverts(registry.registerArtwork("Artwork 1", "The Sun", "Satoshi Nakamoto"));
    });

});
