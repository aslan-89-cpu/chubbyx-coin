(function() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // دروستکردنی شاشەی سەرەکی جزدان
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            
            <!-- هۆڵدەری دوگمەی فەرمی TON -->
            <div id="ton-connect-btn-holder" style="margin-bottom: 20px; min-height: 44px; display: flex; justify-content: center; align-items: center;"></div>
            
            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 260px; word-break: break-all; font-size: 13px; color: #aaa; margin-top: 10px;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff;"></span>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: 15px; padding: 12px; margin-bottom: 120px; z-index: 2000; position: relative;">Back to Home</button>
    `;

    let tonConnectUI = null;

    // کردارێک بۆ دروستکردنی ئۆتۆماتیکی دوگمەکە کاتێک بەکارهێنەر دێتە سەر ئەم لاپەڕەیە
    function initTonConnect() {
        if (tonConnectUI) return; // ئەگەر پێشتر دروست ببوو، دووبارەی ناکاتەوە

        try {
            tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
                manifestUrl: 'tonconnect-manifest.json',
                buttonRootId: 'ton-connect-btn-holder'
            });

            tonConnectUI.onStatusChange(wallet => {
                const statusLabel = document.getElementById('wallet-status-text');
                const detailsBox = document.getElementById('wallet-details-box');
                const addressString = document.getElementById('wallet-address-string');

                if (!statusLabel) return;

                if (wallet) {
                    statusLabel.innerText = "Your TON wallet is successfully connected!";
                    if (detailsBox && addressString) {
                        detailsBox.style.display = 'block';
                        const rawAddress = wallet.account.address;
                        addressString.innerText = rawAddress.substring(0, 6) + "..." + rawAddress.substring(rawAddress.length - 6);
                    }
                } else {
                    statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                    if (detailsBox) detailsBox.style.display = 'none';
                }
            });
        } catch (error) {
            console.error("TON Connect failed to load:", error);
        }
    }

    // بەکارهێنانی setInterval بۆ پشکنینی ئەوەی کەی لاپەڕەکە چالاک (Active) دەبێت بۆ ئەوەی دوگمەکە لۆد بێت
    setInterval(() => {
        if (walletPage.classList.contains('active')) {
            initTonConnect();
        }
    }, 300);
})();
