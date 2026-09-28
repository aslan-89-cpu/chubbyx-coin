// یەکەمجار ڕاستەوخۆ دەق و دوگمەکە دروست دەکەین بۆ ئەوەی مەحاڵ بێت شاشەکە بەتاڵ بمێنێتەوە
const walletPage = document.getElementById('wallet-page');

if (walletPage) {
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            
            <!-- دوگمەیەکی جێگیر کە هەمیشە دیار دەبێت -->
            <button id="custom-ton-connect-btn" style="background: #0098ea; color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0, 152, 234, 0.3);">
                💎 Connect TON Wallet
            </button>
            
            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 260px; word-break: break-all; font-size: 13px; color: #aaa; margin-top: 20px;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff;"></span>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: 15px; padding: 12px; margin-bottom: 120px; z-index: 2000; position: relative;">Back to Home</button>
    `;
}

// پاشان لە پشت شاشەوە بە هێمنی پەیوەندی بە کتێبخانەی TON Connect دەکەین بەبێ ئەوەی شاشەکە ڕەش بکات
setTimeout(function() {
    try {
        // پشکنینی ئەوەی ئایا کتێبخانەکە لەسەر شاشە هەیە
        const tonUI = window.TON_CONNECT_UI || (window.Telegram && window.Telegram.WebApp ? window.parent.TON_CONNECT_UI : null);
        
        if (tonUI && tonUI.TonConnectUI) {
            const tonConnectUI = new tonUI.TonConnectUI({
                manifestUrl: 'tonconnect-manifest.json'
            });

            // گوێگرتن لە گۆڕانکاری دۆخی جزدان
            tonConnectUI.onStatusChange(wallet => {
                const statusLabel = document.getElementById('wallet-status-text');
                const detailsBox = document.getElementById('wallet-details-box');
                const addressString = document.getElementById('wallet-address-string');
                const customBtn = document.getElementById('custom-ton-connect-btn');

                if (wallet) {
                    if (statusLabel) statusLabel.innerText = "Your TON wallet is successfully connected!";
                    if (customBtn) {
                        customBtn.innerText = "Disconnect Wallet";
                        customBtn.style.background = "#ff4a4a";
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

            // بەستنەوەی کردار بە دوگمەکەوە
            const customBtn = document.getElementById('custom-ton-connect-btn');
            if (customBtn) {
                customBtn.onclick = async function() {
                    if (tonConnectUI.connected) {
                        await tonConnectUI.disconnect();
                    } else {
                        await tonConnectUI.openModal();
                    }
                };
            }
        } else {
            // ئەگەر کتێبخانەکە هێشتا لۆد نەببوو، کاتێک کلیک لە دوگمەکە دەکرێت ئاگاداری دەدات نەک شاشەکە بشارێتەوە
            const customBtn = document.getElementById('custom-ton-connect-btn');
            if (customBtn) {
                customBtn.onclick = function() {
                    alert("TON SDK is initializing... Please try again in a few seconds.");
                };
            }
        }
    } catch (error) {
        console.error("Backstage TON integration bypassed:", error);
    }
}, 500);
