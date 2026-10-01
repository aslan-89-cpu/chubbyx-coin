if (!window.TonConnectSDK) {
    const script = document.createElement('script');
    // لێرەدا بەستەری ڕاست و دروستی فەرمی TON Connect UI جێگیر کراوە و هەرگیز دەستکاری مەکە
    script.src = "https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js";
    document.head.appendChild(script);
    
    script.onload = () => {
        initWalletPage();
    };
} else {
    initWalletPage();
}

function initWalletPage() {
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

    setupTonConnect();
}

function setupTonConnect() {
    try {
        const SDK = window.TonConnectSDK ? window.TonConnectSDK.TonConnectUI : null;
        
        if (SDK) {
            const mnf = "tonconnect-manifest.json";
            const fld = "chubbyx-coin";
            const fulllink = window.location.origin + "/" + fld + "/" + mnf;
            
            console.log("Loading from:", fulllink);
            
            const tonConnectUI = new SDK({
                manifestUrl: fulllink,
                buttonRootId: 'ton-connect-button'
            });

            tonConnectUI.onStatusChange(wallet => {
                if (wallet) {
                    const userAddress = wallet.account.address;
                    console.log("Wallet connected:", userAddress);
                    
                    if (typeof window.saveUserWallet === 'function') {
                        window.saveUserWallet(userAddress);
                    }
                } else {
                    console.log("Wallet disconnected");
                }
            });
        }
    } catch (e) {
        console.error("TON SDK Failed: ", e);
    }
}
