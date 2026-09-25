// Initialize TON Connect UI
const tonConnectUI = new TonConnectUI.TonConnectUI({
    manifestUrl: 'https://githubusercontent.com',
    buttonRootId: 'ton-connect-button'
});

// Monitor Wallet Connection Status
tonConnectUI.onStatusChange(wallet => {
    if (wallet) {
        console.log('Wallet connected successfully:', wallet.account.address);
        // Here you can save the user wallet address to your database later
    } else {
        console.log('Wallet disconnected');
    }
});
