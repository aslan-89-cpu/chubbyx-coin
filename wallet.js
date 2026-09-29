function initWalletPage() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // دروستکردنی ڕووکاری ناو لاپەڕەی جزدان
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            <div id="ton-connect-button" style="margin-bottom: 25px;"></div>
            <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 280px;">
                Back to Home
            </button>
        </div>
    `;

    try {
        // پشکنینی لۆدبوونی سکریپتی فەرمی TON Connect
        const SDK = window.TonConnectUI || (window.TonConnectSDK ? window.TonConnectSDK.TonConnectUI : null);
        if (SDK) {
            // وەرگرتنی بەستەری ماڵپەڕەکە بە دروستی بۆ دۆزینەوەی مانیفێست
            let currentPath = window.location.href.split('?')[0];
            if (currentPath.endsWith('index.html')) {
                currentPath = currentPath.replace('index.html', '');
            }
            if (!currentPath.endsWith('/')) {
                currentPath += '/';
            }
            
            // دروستکردنی ئۆجێکتی فەرمی TON Connect
            new SDK({
                manifestUrl: currentPath + 'tonconnect-manifest.json',
                buttonRootId: 'ton-connect-button'
            });
        }
    } catch (e) {
        console.error("TON SDK failed:", e);
    }
}

// کارپێکردنی ئۆتۆماتیکی فەنکشنەکە کاتێک پەیجەکە ئامادە دەبێت
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWalletPage);
} else {
    initWalletPage();
}
