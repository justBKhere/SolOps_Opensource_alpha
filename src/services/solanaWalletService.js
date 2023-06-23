const solanaWeb3 = require('@solana/web3.js');
const { Keypair, Wallet } = require('@solana/web3.js');

let util = require('util');
let ed25519_hd_key = require('ed25519-hd-key');

const bip39 = require('bip39');
const config = require('../utils/config');
const { getConnection } = require('./solanaConnectionService');

let solanaEndpoint = config.devnetEndpoint; // Default to Devnet endpoint

function generateMnemonic() {
    // Generate a new mnemonic phrase
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;
}

//Generate solana wallet using mnemonics
async function generateSolanaWallet() {
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedArray = new Uint8Array(seed);
    const keypair = Keypair.fromSeed(seedArray.slice(0, 32));

    console.log(mnemonic);
    console.log(keypair.publicKey.toBase58());
    return {
        publicKey: keypair.publicKey.toBase58(),
        secretKey: keypair.secretKey.toString(),
        mnemonic: mnemonic,
    };
}

//npm install bip39 ed25519-hd-key @solana/web3.js


function full_inspect_obj(obj) {
    return util.inspect(obj, {
        showHidden: true,
        depth: null,
        colors: false,
        maxArrayLength: null
    });
}

function generate_Sol_wallet_Phantom_Compatible() {
    let wallet = {};
    let mnemonic = bip39.generateMnemonic();
    let master_seed = bip39.mnemonicToSeedSync(mnemonic);
    let index = 0;
    let derived_path = "m/44'/501'/" + index + "'/0'";
    let derived_seed = ed25519_hd_key.derivePath(derived_path, master_seed.toString('hex')).key;
    wallet.keypair = solanaWeb3.Keypair.fromSeed(derived_seed);
    wallet.mnemonic = mnemonic;
    wallet.publicAddress = wallet.keypair.publicKey.toBase58();
    console.log("wallet2" + wallet.mnemonic);
    console.log(wallet.keypair.publicKey.toBase58());
    return wallet;
}


async function loadSolanaWallet(mnemonic) {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedArray = new Uint8Array(seed);
    const keypair = Keypair.fromSeed(seedArray.slice(0, 32));

    return keypair;
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
    generateSolanaWallet,
    generate_Sol_wallet_Phantom_Compatible,
};
