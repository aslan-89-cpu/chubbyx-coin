(function() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // دروستکردنی شاشەی جزدان لەناو فایلی خۆیدا
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            
            <!-- ئەم کۆنتێنەرە جێگەی دروستبوونی دوگمە فەرمییەکەی تۆڕی TON دەبێت -->
            <div id="ton-connect-btn-holder" style="margin-bottom: 20px;"></div>
            
            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 260px; word-break: break-all; font-size: 13px; color: #aaa; margin-top: 10px;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff;"></span>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: 15px; padding: 12px; margin-bottom: 120px; z-index: 2000; position: relative;">Back to Home</button>
    `;

    // دەستپێکردنی لۆژیکی بەستنەوەی جزدان بە بەکارهێنانی کتێبخانەی فەرمی TON
    try {
        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'tonconnect-manifest.json',
            buttonRootId: 'ton-connect-btn-holder'
        });

        // چاودێریکردنی گۆڕانکارییەکانی دۆخی جزدان (بەستراوە یان پچڕاوە)
        tonConnectUI.onStatusChange(wallet => {
            const statusLabel = document.getElementById('wallet-status-text');
            const detailsBox = document.getElementById('wallet-details-box');
            const addressString = document.getElementById('wallet-address-string');

            if (!statusLabel) return;

            if (wallet) {
                // ئەگەر جزدانەکە بە سەرکەوتوویی بەسترا کاتێک بەکارهێنەر کلیکی لێ دەکات
                statusLabel.innerText = "Your TON wallet is successfully connected!";
                if (detailsBox && addressString) {
                    detailsBox.style.display = 'block';
                    const rawAddress = wallet.account.address;
                    // کورتکردنەوەی ناونیشانی جزدانەکە بۆ ئەوەی جوان دەرکەوێت (بۆ نموونە: UQ...A3x)
                    addressString.innerText = rawAddress.substring(0, 6) + "..." + rawAddress.substring(rawAddress.length - 6);
                }
                localStorage.setItem('chubby_wallet_state', 'connected');
            } else {
                // ئەگەر جزدانەکە پچڕا (Disconnect بوو)
                statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                if (detailsBox) detailsBox.style.display = 'none';
                localStorage.removeItem('chubby_wallet_state');
            }
        });
    } catch (error) {
        console.error("TonConnect error:", error);
    }
})();
