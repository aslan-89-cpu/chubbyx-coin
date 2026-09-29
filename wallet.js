(function () {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // ڕووکاری فەرمی لەگەڵ شوێنی دوگمەی شینی فەرمی TON
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            
            <!-- لێرەدا دوگمە شینە فەرمییەکە بە شێوەیەکی ئۆتۆماتیکی دروست دەبێت -->
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
                // چاککردنی split بۆ ئەوەی خەتا نەدات و تەنها دەقی پێش نیشانەی پرسیارەکە بگرێت
                let currentPath = window.location.href.split('?')[0];
                if (currentPath.endsWith('index.html')) {
                    currentPath = currentPath.replace('index.html', '');
                }
                if (!currentPath.endsWith('/')) {
                    currentPath += '/';
                }
                const manifestLink = currentPath + 'tonconnect-manifest.json';

                console.log("Loading manifest from:", manifestLink);

                // دروستکردنی دوگمە فەرمییەکەی TON Connect
                new SDK.TonConnectUI({
                    manifestUrl: manifestLink,
                    buttonRootId: 'ton-connect-button'
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
