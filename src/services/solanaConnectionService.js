const solanaWeb3 = require('@solana/web3.js');
const config = require('../utils/config');

let solanaEndpoint = config.devnetEndpoint; // Default to Devnet endpoint

function setSolanaEndpoint(network) {
    if (network === 'devnet') {
        solanaEndpoint = config.devnetEndpoint;
    } else if (network === 'testnet') {
        solanaEndpoint = config.testnetEndpoint;
    } else if (network === 'mainnet') {
        solanaEndpoint = config.mainnetEndpoint;
    } else {
        throw new Error('Invalid network choice');
    }
}

function getConnection() {
    const connection = new solanaWeb3.Connection(solanaEndpoint);
    return connection;
}

module.exports = {
    setSolanaEndpoint,
    getConnection,
};
