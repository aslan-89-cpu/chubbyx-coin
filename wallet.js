// لۆجیکی سەرەکی و فەرمی TON Connect 

let globalTonConnect = null;

document.addEventListener("DOMContentLoaded", function () {
    try {
        if (window.TON_CONNECT_UI && window.TON_CONNECT_UI.TonConnectUI) {
            globalTonConnect = new window.TON_CONNECT_UI.TonConnectUI({
                manifestUrl: 'tonconnect-manifest.json'
            });

            // گوێگرتن لە گۆڕانکاری و بارودۆخی جزدانەکە
            globalTonConnect.onStatusChange(wallet => {
                const statusLabel = document.getElementById('wallet-status-text');
                const detailsBox = document.getElementById('wallet-details-box');
                const addressString = document.getElementById('wallet-address-string');
                const customBtn = document.getElementById('custom-ton-connect-btn');

                if (wallet) {
                    if (statusLabel) statusLabel.innerText = "Your TON wallet is successfully connected!";
                    if (customBtn) {
                        customBtn.innerText = "Disconnect Wallet";
                        customBtn.style.background = "#ff4d4d";
                    }
                    
                    const rawAddress = wallet.account.address;
                    if (detailsBox && addressString) {
                        detailsBox.style.display = 'block';
                        addressString.innerText = rawAddress.substring(0, 6) + "..." + rawAddress.substring(rawAddress.length - 6);
                    }
                } else {
                    if (statusLabel) statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                    if (customBtn) {
                        customBtn.innerText = "💎 Connect TON Wallet";
                        customBtn.style.background = "#0088cc";
                    }
                    if (detailsBox) detailsBox.style.display = 'none';
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
});

// گونجاندنی فەرمانی کلیک بۆ چالاککردنی مۆداڵی فەرمی جزدانەکە
window.addEventListener('triggerTonConnect', async function () {
    if (globalTonConnect) {
        if (globalTonConnect.connected) {
            await globalTonConnect.disconnect();
        } else {
            await globalTonConnect.openModal();
        }
    }
});
