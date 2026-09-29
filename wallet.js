function initWalletPage() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

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
            // ✅ دروستکردنی ناونیشانی داینامیکی بە بێ نووسینی هیچ جۆرە بەستەرێک
            const fld = "chubbyx-coin";
            const mnf = "tonconnect-manifest.json";
            const fullLink = window.location.origin + "/" + fld + "/" + mnf;
            
            console.log("Loading from:", fullLink);

            new SDK({
                manifestUrl: fullLink,
                buttonRootId: 'ton-connect-button'
            });
        }
    } catch (e) {
        console.error("TON SDK failed:", e);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWalletPage);
} else {
    initWalletPage();
}
