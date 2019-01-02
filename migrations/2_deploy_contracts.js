const InitialArtworkOffering = artifacts.require('./InitialArtworkOffering.sol');
const YairToken = artifacts.require('./YairToken.sol');
const ArtworkRegistry = artifacts.require('./ArtworkRegistry.sol');
const OwnableMultiple = artifacts.require('./OwnableMultiple.sol');

const ARTWORK_ID_DEFAULT = 'artwork_0';

module.exports = function(deployer, network, accounts) {
    const openingTime = web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
    const closingTime = openingTime + 86400 * 30; // 30 days
    const rate = new web3.BigNumber(1000);
    const wallet = accounts[1];


    return deployer
        .then(() => {
            return deployer.deploy(ArtworkRegistry);
        })

        .then(() => {
            return deployer.deploy(OwnableMultiple);
        })

        .then(() => {
            return deployer.deploy(YairToken, 0, 1000);
        })
        .then(() => {
            console.log(YairToken.address);
            return deployer.deploy(
                InitialArtworkOffering,
                openingTime,
                closingTime,
                rate,
                wallet,
                YairToken.address
            );
        });
};