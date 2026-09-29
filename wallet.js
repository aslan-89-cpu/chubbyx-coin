(function () {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // لێرەدا شوێنی دوگمە فەرمییەکەی TON دابین کراوە بە ناسنامەی (ton-connect-button)
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            
            <!-- دوگمە فەرمییەکە لێرەدا خۆی دروست دەبێت -->
            <div id="ton-connect-button" style="margin-bottom: 25px;"></div>
            
            <button class="btn-top" onclick="if(typeof switchPage === 'function'){switchPage('home')}else{window.location.reload()}" style="width: 100%; max-width: 280px;">
                Back to Home
            </button>
        </div>
    `;

    function initTonSdk() {
        try {
            const SDK = window.TonConnectUI || window.TON_CONNECT_UI;
            if (SDK) {
                // دروستکردنی بەستەری دروستی مانیفێست بە شێوەیەکی گشتگیر
                const manifestLink = window.location.origin + "/tonconnect-manifest.json";

                // ڕاستەوخۆ بەستنی دوگمە فەرمییەکە بە لۆجیکەکەوە
                new SDK.TonConnectUI({
                    manifestUrl: manifestLink,
                    buttonRootId: 'ton-connect-button' // ئەوە هێمای دروستبوونی دوگمەکەیە
                });
            } else {
                setTimeout(initTonSdk, 200);
            }
        } catch (e) {
            console.error("SDK Initialization failed:", e);
        }
    }

    initTonSdk();
})();
