(function() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // Rendering the English layout with a custom interactive button
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            <button id="custom-ton-click-btn" style="background: #0098ea; color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.63 9.42L13.9 16.58C13.78 16.9 13.43 17.06 13.12 16.94C12.98 16.89 12.86 16.79 12.79 16.65L11.14 13.14L7.63 11.49C7.31 11.34 7.17 10.96 7.32 10.64C7.38 10.51 7.49 10.4 7.63 10.34L14.79 7.61C15.11 7.49 15.46 7.65 15.58 7.96C15.63 8.1 15.63 8.25 15.58 8.39L14.24 11.76L16.63 9.42Z" fill="white"/></svg>
                Connect Wallet
            </button>
            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 240px; margin-top: 25px; text-align: left;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff; font-size: 13px; word-break: break-all;"></span>
            </div>
            <button class="btn-top" onclick="if(typeof switchPage === 'function'){switchPage('home')}else{window.location.reload()}" style="width: 100%; max-width: 240px; margin-top: 35px; padding: 12px; z-index: 10;">Back to Home</button>
        </div>
    `;

    let tonConnectInstance = null;

    function initTonSDK() {
        try {
            const SDK = window.TonConnectUI || window.TON_CONNECT_UI;
            if (SDK) {
                // Initializing using the absolute valid manifest link we just fixed
                tonConnectInstance = new SDK.TonConnectUI({
                    manifestUrl: window.location.origin + window.location.pathname.replace('index.html', '') + 'tonconnect-manifest.json',
                });

                // Listen for wallet connection updates
                tonConnectInstance.onStatusChange(wallet => {
                    const statusLabel = document.getElementById('wallet-status-text');
                    const detailsBox = document.getElementById('wallet-details-box');
                    const addressString = document.getElementById('wallet-address-string');
                    const customBtn = document.getElementById('custom-ton-click-btn');

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
                        saveWalletToFirebase(wallet.account.address);
                    } else {
                        if (statusLabel) statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                        if (customBtn) {
                            customBtn.innerText = "Connect Wallet";
                            customBtn.style.background = "#0098ea";
                        }
                        if (detailsBox) detailsBox.style.display = 'none';
                    }
                });
            } else {
                setTimeout(initTonSDK, 200);
            }
        } catch (e) {
            console.error("SDK bootstrap failed:", e);
        }
    }

    initTonSDK();

    // Triggering the direct click injection to open Tonkeeper modal directly
    const targetBtn = document.getElementById('custom-ton-click-btn');
    if (targetBtn) {
        targetBtn.onclick = async function() {
            if (tonConnectInstance) {
                try {
                    if (tonConnectInstance.connected) {
                        await tonConnectInstance.disconnect();
                    } else {
                        // This opens the UI connection window directly on click
                        await tonConnectInstance.openModal();
                    }
                } catch (err) {
                    console.error("Wallet popup request failed:", err);
                }
            } else {
                alert("TON Connect system is loading, please try again in a second.");
            }
        };
    }
})();

function saveWalletToFirebase(address) {
    const tg = window.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    if (userId && typeof db !== 'undefined') {
        db.collection("users").doc(userId.toString()).set({
            walletAddress: address
        }, { merge: true });
    }
}
