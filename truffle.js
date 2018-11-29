/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {

    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 1000000,
      gasPrice: 10000000000,
      //from: web3.eth.accounts[0]
    }
/*    testnet: {
      host: "127.0.0.1",
      //host: "192.241.195.178",
      port: 45585,
      network_id: "*", // Match any network id
      gas: 4712388, // 4 milliShannon
      gasPrice:100000000000, // 100 Shannon == 100 billion Wei
      //from: web3.eth.accounts[0]
    },
    live: {
      host: "localhost",
      port:8545,
      network_id: 1,
      gas: 4712388, // 4 milliShannon
      gasPrice:100000000000, // 100 Shannon == 100 billion Wei
      //from: web3.eth.accounts[0]
    }*/
  }
};
