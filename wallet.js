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
        const SDK = window.TonConnectUI || (window.TonConnectSDK ? window.TonConnectSDK.TonConnectUI : null);
        if (SDK) {
            // ✅ دۆزینەوەی بەستەری ڕەها بۆ فایلی مانیفێست بە بێ بەکارهێنانی split
            const baseUrl = window.location.origin + window.location.pathname;
            let dirUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
            if (!dirUrl.endsWith('/')) dirUrl += '/';
            
            const manifestLink = dirUrl + 'tonconnect-manifest.json';
            console.log("Manifest absolute link:", manifestLink);

            // دروستکردنی ئۆجێکتی فەرمی TON Connect
            new SDK({
                manifestUrl: manifestLink,
                buttonRootId: 'ton-connect-button'
            });
        } else {
            console.error("TON Connect SDK is not loaded on window.");
        }
    } catch (e) {
        console.error("TON SDK initialization failed:", e);
    }
}

// کارپێکردنی ئۆتۆماتیکی کاتێک پەیجەکە ئامادە دەبێت
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWalletPage);
} else {
    initWalletPage();
}
