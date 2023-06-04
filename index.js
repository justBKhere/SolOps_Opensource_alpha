const {
    generateMnemonic,
    generateWallet,
    getWalletBalance,
    getTokenBalance,
    getTransactionHistory,
    getTokenTransactionHistory,
    airdropSol,
    setSolanaEndpoint,
    getAllTokenBalances,
} = require('./src/services/solanaService');

async function test() {
    // Generate a mnemonic phrase
    const mnemonic = generateMnemonic();
    console.log('Mnemonic:', mnemonic);

    // Generate a wallet
    const wallet = generateWallet();
    console.log('Wallet:', wallet);

    // Set the Solana endpoint
    setSolanaEndpoint('devnet');

    // Get the wallet balance
    const walletBalance = await getWalletBalance(wallet.address);
    console.log('Wallet Balance:', walletBalance);

    // Get the token balance
    const tokenAddress = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'; // Replace with the your token address
    const tokenBalance = await getTokenBalance(wallet.address, tokenAddress);
    console.log('Token Balance:', tokenBalance);

    // Get the transaction history
    const transactionHistory = await getTransactionHistory(wallet.address);
    console.log('Transaction History:', transactionHistory);

    // Get the token transaction history
    const tokenTransactionHistory = await getTokenTransactionHistory(wallet.address, tokenAddress);
    console.log('Token Transaction History:', tokenTransactionHistory);

    // Airdrop SOL to the wallet
    /*const airdropResult = await airdropSol(wallet.address);
    console.log('Airdrop Result:', airdropResult);

*/
}

test().catch((error) => {
    console.error('Error:', error);
});

