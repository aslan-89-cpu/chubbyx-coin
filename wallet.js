// دروستکردنی شاشەی جزدان بە شێوەیەکی جێگیر
const walletPage = document.getElementById('wallet-page');

if (walletPage) {
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            
            <!-- دوگمە شینە سەرکەوتووەکەت -->
            <button id="custom-ton-connect-btn" style="background: #0098ea; color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0, 152, 234, 0.3);">
                💎 Connect TON Wallet
            </button>
            
            <!-- هۆڵدەرێکی بچووکی شاراوە بۆ جێگیرکردنی لۆژیکی TON Connect -->
            <div id="hidden-ton-btn" style="display: none;"></div>
            
            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 260px; word-break: break-all; font-size: 13px; color: #aaa; margin-top: 20px;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff;"></span>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: 15px; padding: 12px; margin-bottom: 120px; z-index: 2000; position: relative;">Back to Home</button>
    `;
}

// بەڕێکردنی لۆژیکی بەستنەوە لە پشت شاشەوە بە شێوازی سەلامەت
setTimeout(function() {
    try {
        if (window.TON_CONNECT_UI && window.TON_CONNECT_UI.TonConnectUI) {
            // دروستکردنی ئۆبجێکتی فەرمی بەستراو بە هۆڵدەرە شاراوەکەوە
            const tonConnectUI = new window.TON_CONNECT_UI.TonConnectUI({
                manifestUrl: 'tonconnect-manifest.json',
                buttonRootId: 'hidden-ton-btn'
            });

            // گوێگرتن لە دۆخی جزدان بۆ نوێکردنەوەی شاشە شینەکە
            tonConnectUI.onStatusChange(wallet => {
                const statusLabel = document.getElementById('wallet-status-text');
                const detailsBox = document.getElementById('wallet-details-box');
                const addressString = document.getElementById('wallet-address-string');
                const customBtn = document.getElementById('custom-ton-connect-btn');

                if (wallet) {
                    if (statusLabel) statusLabel.innerText = "Your TON wallet is successfully connected!";
                    if (customBtn) {
                        customBtn.innerText = "Disconnect Wallet";
                        customBtn.style.background = "#ff4a4a"; // سوور بۆ دیسکۆنێکت
                    }
                    if (detailsBox && addressString) {
                        detailsBox.style.display = 'block';
                        const rawAddress = wallet.account.address;
                        addressString.innerText = rawAddress.substring(0, 6) + "..." + rawAddress.substring(rawAddress.length - 6);
                    }
                } else {
                    if (statusLabel) statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                    if (customBtn) {
                        customBtn.innerText = "💎 Connect TON Wallet";
                        customBtn.style.background = "#0098ea";
                    }
                    if (detailsBox) detailsBox.style.display = 'none';
                }
            });

            // کاتێک کلیک لە دوگمە شینەکە دەکرێت، مۆداڵی فەرمی TON دەکرێتەوە
            const customBtn = document.getElementById('custom-ton-connect-btn');
            if (customBtn) {
                customBtn.onclick = async function() {
                    try {
                        if (tonConnectUI.connected) {
                            await tonConnectUI.disconnect();
                        } else {
                            // کردنەوەی مۆداڵ بۆ هەڵبژاردنی جزدان
                            await tonConnectUI.openModal();
                        }
                    } catch (btnErr) {
                        console.error("Modal interaction error:", btnErr);
                    }
                };
            }
        }
    } catch (error) {
        console.error("TON SDK initialization bypassed:", error);
    }
}, 400);
