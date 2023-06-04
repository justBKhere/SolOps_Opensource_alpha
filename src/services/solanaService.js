const solanaWeb3 = require('@solana/web3.js');
const bip39 = require('bip39');
const config = require('../utils/config');

const Token = require('@solana/spl-token');
const TOKEN_PROGRAM_ID = require('@solana/spl-token');

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
        const connection = new solanaWeb3.Connection(solanaEndpoint);

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

async function getTokenBalance(walletAddress, tokenAddress) {
    try {
        // Connect to the Solana network using the specified endpoint
        const connection = new solanaWeb3.Connection(solanaEndpoint);

        // Retrieve the token account associated with the wallet address
        const publicKey = new solanaWeb3.PublicKey(walletAddress);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: new solanaWeb3.PublicKey(tokenAddress),
        });

        // Extract the token balance from the account information
        const tokenBalance = tokenAccounts.value.reduce((balance, account) => {
            return balance + account.account.data.parsed.info.tokenAmount.uiAmount;
        }, 0);

        // Return the token balance
        return {
            success: true,
            balance: tokenBalance,
        };
    } catch (error) {
        console.error('Error fetching token balance:', error.message);
        return {
            success: false,
            error: 'Failed to fetch token balance',
        };
    }
}

async function getTransactionHistory(walletAddress) {
    try {
        // Connect to the Solana network using the specified endpoint
        const connection = new solanaWeb3.Connection(solanaEndpoint);

        // Get transaction history for the wallet address
        const publicKey = new solanaWeb3.PublicKey(walletAddress);
        const transactionHistory = await connection.getConfirmedSignaturesForAddress2(publicKey);

        // Return the transaction history
        return {
            success: true,
            history: transactionHistory,
        };
    } catch (error) {
        console.error('Error fetching transaction history:', error.message);
        return {
            success: false,
            error: 'Failed to fetch transaction history',
        };
    }
}

async function getTokenTransactionHistory(walletAddress, tokenAddress) {
    try {
        // Connect to the Solana network using the specified endpoint
        const connection = new solanaWeb3.Connection(solanaEndpoint);

        // Retrieve the token account associated with the wallet address
        const publicKey = new solanaWeb3.PublicKey(walletAddress);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: new solanaWeb3.PublicKey(tokenAddress),
        });

        if (tokenAccounts.value.length === 0) {
            return {
                success: false,
                error: 'No token accounts found for the provided wallet address',
            };
        }

        // Retrieve the transaction history for the token account
        const tokenHistory = await connection.getTokenAccountTransactionHistory(
            new solanaWeb3.PublicKey(tokenAccounts.value[0].pubkey),
            {
                commitment: 'confirmed',
            }
        );

        // Return the token transaction history
        return {
            success: true,
            history: tokenHistory,
        };
    } catch (error) {
        console.error('Error fetching token transaction history:', error.message);
        return {
            success: false,
            error: 'Failed to fetch token transaction history',
        };
    }
}

async function airdropSol(walletAddress) {
    try {
        // Connect to the Solana network using the specified endpoint
        const connection = new solanaWeb3.Connection(solanaEndpoint);

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

module.exports = {
    generateMnemonic,
    generateWallet,
    getWalletBalance,
    getTokenBalance,
    getTransactionHistory,
    getTokenTransactionHistory,
    airdropSol,
    setSolanaEndpoint,
};
