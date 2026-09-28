(function() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // Building the Wallet UI in pure English
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            <button id="custom-ton-connect-btn" style="background: #0098ea; color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; cursor: pointer;">
                Connect TON Wallet
            </button>
            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 240px; margin-top: 15px; text-align: left;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff;"></span>
            </div>
            <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: 15px; padding: 12px; margin-bottom: 12px; z-index: 10;">Back to Home</button>
        </div>
    `;

    // Dynamic injection of official TON Connect UI library
    let tonConnectInstance = null;
    const script = document.createElement('script');
    script.src = "https://unpkg.com";
    document.head.appendChild(script);

    script.onload = () => {
        try {
            // Initializing TON Connect with your Github absolute manifest link
            tonConnectInstance = new TONConnectUI.TonConnectUI({
                manifestUrl: 'https://github.io',
                buttonRootId: 'custom-ton-connect-btn'
            });

            // Tracking wallet connection status changes
            tonConnectInstance.onStatusChange(wallet => {
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
                    // Saving wallet address data directly to Firebase
                    saveWalletToFirebase(wallet.account.address);
                } else {
                    if (statusLabel) statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                    if (customBtn) {
                        customBtn.innerText = "Connect TON Wallet";
                        customBtn.style.background = "#0098ea";
                    }
                    if (detailsBox) detailsBox.style.display = 'none';
                }
            });

        } catch (e) {
            console.error("SDK initiation error:", e);
        }
    };

    // Handling user click events safely in English
    document.addEventListener('click', async function(e) {
        if (e.target && e.target.id === 'custom-ton-connect-btn') {
            if (tonConnectInstance) {
                try {
                    if (tonConnectInstance.connected) {
                        await tonConnectInstance.disconnect();
                    } else {
                        await tonConnectInstance.openModal();
                    }
                } catch (err) {
                    console.error("Modal failed:", err);
                }
            } else {
                alert("TON wallet system is initializing, please click again in a second.");
            }
        }
    });
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
