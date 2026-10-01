function loadWalletUI() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p style="color: #ccc; margin-bottom: 30px; max-width: 288px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            <div id="ton-connect-button" style="margin-bottom: 25px;"></div>
            <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 288px;">
                Back to Home
            </button>
        </div>
    `;

    setTimeout(setupTonConnect, 100);
}

function setupTonConnect() {
    try {
        const SDK = window.TonConnectSDK ? window.TonConnectSDK.TonConnectUI : null;
        
        if (SDK) {
            // بەم شێوازە ناونیشانەکە بە پارچەیی دەکەین تا کێبۆردەکەت کورت نەکاتەوە
            const start = "https://";
            const user = "aslan-89-cpu";
            const host = ".github.io/";
            const repo = "chubbyx-coin/";
            const file = "tonconnect-manifest.json";
            
            const fulllink = start + user + host + repo + file;
            
            console.log("Loading manifest from:", fulllink);
            
            const tonConnectUI = new SDK({
                manifestUrl: fulllink,
                buttonRootId: 'ton-connect-button'
            });

            tonConnectUI.onStatusChange(wallet => {
                if (wallet) {
                    const userAddress = wallet.account.address;
                    console.log("Wallet connected:", userAddress);
                    localStorage.setItem('user_wallet_address', userAddress);
                } else {
                    localStorage.removeItem('user_wallet_address');
                }
            });
        }
    } catch (e) {
        console.error("TON SDK Error: ", e);
    }
}

const originalSwitchPage = window.switchPage;
window.switchPage = function(pageId, element) {
    if (typeof originalSwitchPage === 'function') {
        originalSwitchPage(pageId, element);
    }
    
    if (pageId === 'wallet') {
        loadWalletUI();
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadWalletUI);
} else {
    loadWalletUI();
}
