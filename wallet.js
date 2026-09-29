// ==========================================
// CHUBBYX WALLET MODULE (FULL SOURCE CODE)
// ==========================================

function initWalletPage() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // 1. Rendering the official Wallet UI layout
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            <button id="custom-ton-click-btn" style="background: #0098ea; color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 16px;">
                💎 Connect TON Wallet
            </button>
            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 240px; margin-top: 25px; text-align: left;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff; font-size: 13px; word-break: break-all;"></span>
            </div>
            <button class="btn-top" onclick="if(typeof switchPage === 'function'){switchPage('home')}else{window.location.reload()}" style="width: 100%; max-width: 240px; margin-top: 35px; padding: 12px; z-index: 10;">Back to Home</button>
        </div>
    `;

    let tonConnectInstance = null;

    // 2. Initializing TON Connect SDK and Event Handlers
    function initTonSDK() {
        try {
            const SDK = window.TonConnectUI || window.TON_CONNECT_UI;
            if (!SDK) {
                console.error("TON Connect SDK library not found in window object.");
                return;
            }

            // Dynamically generate manifest link matching your repository structure
            const manifestLink = window.location.origin + window.location.pathname.replace('index.html', '') + 'tonconnect-manifest.json';
            
            tonConnectInstance = new SDK.TonConnectUI({
                manifestUrl: manifestLink
            });

            // Monitor real-time status changes from Tonkeeper
            tonConnectInstance.onStatusChange(wallet => {
                const statusLabel = document.getElementById('wallet-status-text');
                const detailsBox = document.getElementById('wallet-details-box');
                const addressString = document.getElementById('wallet-address-string');
                const customBtn = document.getElementById('custom-ton-click-btn');

                if (wallet) {
                    if (statusLabel) statusLabel.innerText = "Your TON wallet is successfully connected!";
                    if (detailsBox) detailsBox.style.display = "block";
                    if (addressString) addressString.innerText = wallet.account.address;
                    if (customBtn) {
                        customBtn.innerText = "Disconnect Wallet";
                        customBtn.style.background = "#ff4a4a";
                    }
                    
                    // Directly execute saving the address to your Firestore DB
                    saveWalletToFirebase(wallet.account.address);
                } else {
                    if (statusLabel) statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                    if (detailsBox) detailsBox.style.display = "none";
                    if (customBtn) {
                        customBtn.innerText = "💎 Connect TON Wallet";
                        customBtn.style.background = "#0098ea";
                    }
                }
            });

            // 3. Attach click event to trigger the wallet connection modal directly
            const targetBtn = document.getElementById("custom-ton-click-btn");
            if (targetBtn) {
                targetBtn.onclick = async function() {
                    if (tonConnectInstance) {
                        try {
                            if (tonConnectInstance.connected) {
                                await tonConnectInstance.disconnect();
                            } else {
                                await tonConnectInstance.openModal();
                            }
                        } catch (err) {
                            console.error("Error invoking TON Modal:", err);
                        }
                    }
                };
            }

        } catch (error) {
            console.error("Failed to boot TON Connect Framework:", error);
        }
    }

    initTonSDK();
}

// 4. Securely storing the verified wallet address in Firebase Firestore DB
function saveWalletToFirebase(walletAddress) {
    try {
        // Retrieve current Telegram User ID from webapp initialization context
        let telegramUserId = "unknown_user";
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
            telegramUserId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
        }

        if (telegramUserId === "unknown_user") {
            console.warn("Could not extract Telegram User ID. Retrying outside Telegram frame context.");
        }

        // Verify that Firebase App and Firestore Instance exist on window scope
        if (window.db) {
            // Update or create the document inside the 'users' collection
            const userDocRef = window.db.collection("users").doc(telegramUserId);
            
            userDocRef.set({
                walletAddress: walletAddress,
                walletConnectedAt: new Date().toISOString()
            }, { merge: true })
            .then(() => {
                console.log(`✅ Success: Wallet address for user [${telegramUserId}] synced to Firestore.`);
            })
            .catch((error) => {
                console.error("❌ Error writing wallet record to Firebase Firestore:", error);
            });
        } else {
            console.error("❌ Database Error: Firebase/Firestore (window.db) instance is unavailable.");
        }
    } catch (globalErr) {
        console.error("Global database synchronization failure:", globalErr);
    }
}

// Automatically mount and run the setup
initWalletPage();
