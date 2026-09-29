(function () {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // ڕووکاری ڕەسەن و تەواو بە دوگمەی گەڕانەوەوە
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            <button id="custom-ton-click-btn" style="background: #0098ea; color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-bottom: 20px;">
                💎 Connect TON Wallet
            </button>
            
            <button class="btn-top" onclick="if(typeof switchPage === 'function'){switchPage('home')}else{window.location.reload()}" style="width: 100%; max-width: 280px;">
                Back to Home
            </button>

            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 280px; margin-top: 20px;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff; font-size: 13px; word-break: break-all;"></span>
            </div>
        </div>
    `;

    let tonconnectInstance = null;

    function initTonSdk() {
        try {
            const SDK = window.TonConnectUI || window.TON_CONNECT_UI;
            if (SDK) {
                const manifestLink = window.location.origin + window.location.pathname.replace('index.html', '') + 'tonconnect-manifest.json';
                tonconnectInstance = new SDK.TonConnectUI({
                    manifestUrl: manifestLink
                });

                // بەستنەوەی ڕاستەوخۆی دوگمەکە کاتێک SDK ئامادەیە
                setupButtonAction();

                tonconnectInstance.onStatusChange(wallet => {
                    const statusLabel = document.getElementById('wallet-status-text');
                    const detailsBox = document.getElementById('wallet-details-box');
                    const addressString = document.getElementById('wallet-address-string');
                    const customBtn = document.getElementById('custom-ton-click-btn');

                    if (wallet) {
                        if (statusLabel) statusLabel.innerText = "Your TON wallet is successfully connected!";
                        if (customBtn) {
                            customBtn.innerText = "Disconnect Wallet";
                            customBtn.style.background = "#ff4444";
                        }
                        if (detailsBox && addressString) {
                            detailsBox.style.display = "block";
                            const rawAddress = wallet.account.address;
                            addressString.innerText = rawAddress.substring(0, 6) + "..." + rawAddress.substring(rawAddress.length - 6);
                        }
                        saveWalletToFirebase(wallet.account.address);
                    } else {
                        if (statusLabel) statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                        if (customBtn) {
                            customBtn.innerText = "💎 Connect TON Wallet";
                            customBtn.style.background = "#0098ea";
                        }
                        if (detailsBox) detailsBox.style.display = "none";
                    }
                });
            } else {
                setTimeout(initTonSdk, 200);
            }
        } catch (e) {
            console.error("SDK bootstrap failed:", e);
        }
    }

    function setupButtonAction() {
        const targetBtn = document.getElementById('custom-ton-click-btn');
        if (!targetBtn) return;

        targetBtn.onclick = async function () {
            if (!tonconnectInstance) return;

            try {
                if (tonconnectInstance.connected) {
                    await tonconnectInstance.disconnect();
                } else {
                    // کردنەوەی مۆدێلی فەرمی و ستاندارد کە بە تەواوی پاڵپشتی تێلێگرام دەکات
                    await tonconnectInstance.openModal();
                }
            } catch (err) {
                console.error("Connection flow error:", err);
            }
        };
    }

    function saveWalletToFirebase(address) {
        const tg = window.Telegram?.WebApp;
        const userId = tg?.initDataUnsafe?.user?.id;
        if (userId && typeof db !== 'undefined') {
            db.collection("users").doc(userId.toString()).set({
                walletAddress: address
            }, { merge: true });
        }
    }

    initTonSdk();
})();
