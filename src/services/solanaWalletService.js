const solanaWeb3 = require('@solana/web3.js');
const bip39 = require('bip39');
const config = require('../utils/config');
const { getConnection } = require('./solanaConnectionService');

let solanaEndpoint = config.devnetEndpoint; // Default to Devnet endpoint

function generateMnemonic() {
    // Generate a new mnemonic phrase
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;
}

function generateWallet() {
    // Generate a new mnemonic phrase
    const mnemonic = bip39.generateMnemonic();

    // Derive a keypair from the mnemonic
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const keypair = solanaWeb3.Keypair.fromSeed(seed.slice(0, 32));

    // Retrieve the public key and address
    const publicKey = keypair.publicKey.toString();
    const address = keypair.publicKey.toBase58();

    // Return the generated wallet details
    return {
        mnemonic,
        publicKey,
        address,
    };
}

async function getWalletBalance(walletAddress) {
    try {
        // Connect to the Solana network using the specified endpoint
        const connection = getConnection();

        // Retrieve the balance of the wallet address
        const publicKey = new solanaWeb3.PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);

        // Return the balance
        return {
            success: true,
            balance,
        };
    } catch (error) {
        console.error('Error fetching wallet balance:', error.message);
        return {
            success: false,
            error: 'Failed to fetch wallet balance',
        };
    }
}

async function airdropSol(walletAddress) {
    try {
        // Connect to the Solana network using the specified endpoint
        const connection = getConnection();

        // Airdrop SOL to the wallet address
        const publicKey = new solanaWeb3.PublicKey(walletAddress);
        const airdropAmount = solanaWeb3.LAMPORTS_PER_SOL; // 1 SOL
        const signature = await connection.requestAirdrop(publicKey, airdropAmount);

        // Retrieve the transaction link from the signature
        const transactionLink = `${config.solanaExplorer}/tx/${signature}`;

        // Return the transaction link
        return {
            success: true,
            message: `Airdrop of ${airdropAmount / solanaWeb3.LAMPORTS_PER_SOL} SOL has been sent to ${walletAddress}`,
            transactionLink,
        };
    } catch (error) {
        console.error('Error during SOL airdrop:', error.message);
        return {
            success: false,
            error: 'Failed to perform SOL airdrop',
        };
    }
}


module.exports = {
    generateMnemonic,
    generateWallet,
    getWalletBalance,
    airdropSol,
};
