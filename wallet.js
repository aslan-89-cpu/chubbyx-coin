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
            // لێرەدا بەستەری تەواو و دروستی مانیفێستەکەی تۆم جێگیر کردووەتەوە
            const fulllink = "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";
            
            const tonConnectUI = new SDK({
                manifestUrl: fulllink,
                buttonRootId: 'ton-connect-button'
            });

            tonConnectUI.onStatusChange(wallet => {
                if (wallet) {
                    console.log("Wallet connected:", wallet.account.address);
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
