const BasicToken = artifacts.require('./BasicToken.sol');
const FakeMintable = artifacts.require('./FakeMintable.sol');
const YairToken = artifacts.require('./YairToken.sol');
const YairTokenSale = artifacts.require('./YairTokenSale.sol');
const InitialArtworkOffering = artifacts.require('./InitialArtworkOffering.sol');
const ArtworkRegistry = artifacts.require('./ArtworkRegistry.sol');
const OwnableMultiple = artifacts.require('./OwnableMultiple.sol');

const ARTWORK_ID_DEFAULT = 'artwork_0';

const BigNumber = web3.utils.BN;

module.exports = function(deployer, network, accounts) {
    const openingTime = web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
    const closingTime = openingTime + 86400 * 30; // 30 days
    const rate = new BigNumber(1000);
    const wallet = accounts[1];


    return deployer
        .then(() => {
            return deployer.deploy(ArtworkRegistry);
        })

        .then(() => {
            return deployer.deploy(OwnableMultiple);
        })
/*        .then(() => {
            return deployer.deploy(FakeMintable);
        })*/
        .then(() => {
            return deployer.deploy(BasicToken);
        })

        .then(() => {
            return deployer.deploy(YairToken, 0, 1000);
        })
        .then(() => {
            return deployer.deploy(
                YairTokenSale,
                openingTime,
                closingTime,
                wallet,
                YairToken.address
            );
        })
        .then(() => {
            console.log(YairToken.address);
            return deployer.deploy(
                InitialArtworkOffering,
                openingTime,
                openingTime + 86400 * 1, // 1 days,
                rate,
                wallet,
                YairToken.address
            );
        });
};