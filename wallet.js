// دروستکردنی لاپەڕەکە بە شێوازێکی جێگیر کە لەژێر هیچ مەرجێکدا نەشکێت
function loadWalletUI() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            
            <!-- لێرەدا کۆنتێنەرێکی چۆڵ دادەنێین بۆ ئەوەی دوگمە فەرمییەکەی TON خۆی تێدا دروست ببێت -->
            <div id="ton-connect-button" style="margin-bottom: 25px;"></div>
            
            <div id="wallet-details-box" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 240px; margin-top: 25px; text-align: left;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Address:</span>
                <span id="wallet-address-string" style="color: #fff; font-size: 13px; word-break: break-all;"></span>
            </div>
            <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: 35px; padding: 12px; z-index: 10;">Back to Home</button>
        </div>
    `;

    // چاوەڕێکردنی داینامیکی تاوەکو سورسەکە لە ئینتەرنێتەوە لۆد دەبێت
    const checkSDK = setInterval(() => {
        const SDK = window.TonConnectSDK ? window.TonConnectSDK.TonConnectUI : (window.TON_CONNECT_UI ? window.TON_CONNECT_UI.TonConnectUI : null);
        if (SDK) {
            clearInterval(checkSDK); // کاتێک دۆزرایەوە، چاوەڕێکردنەکە ڕادەگرین
            startTonConnect(SDK);
        }
    }, 100);
}

function startTonConnect(SDK) {
    try {
        // دروستکردنی بەستەری مانیفێست بە شێوازی پارچەپارچە بۆ پاراستنی لە کورتکردنەوە
        const p1 = "https://";
        const p2 = "aslan-89-cpu";
        const p3 = ".github.io/";
        const p4 = "chubbyx-coin/";
        const p5 = "tonconnect-manifest.json";
        const manifestLink = p1 + p2 + p3 + p4 + p5;

        const tonConnectUI = new SDK({
            manifestUrl: manifestLink,
            buttonRootId: 'ton-connect-button' // دروستکردنی دوگمە فەرمییەکە لە ناو سێرڤەری TON خۆیدا
        });

        tonConnectUI.onStatusChange(wallet => {
            const statusLabel = document.getElementById('wallet-status-text');
            const detailsBox = document.getElementById('wallet-details-box');
            const addressString = document.getElementById('wallet-address-string');

            if (wallet) {
                if (statusLabel) statusLabel.innerText = "Your TON wallet is successfully connected!";
                if (detailsBox && addressString) {
                    detailsBox.style.display = 'block';
                    const rawAddress = wallet.account.address;
                    addressString.innerText = rawAddress.substring(0, 6) + "..." + rawAddress.substring(rawAddress.length - 6);
                }
                localStorage.setItem('user_wallet', wallet.account.address);
                if (typeof window.saveWalletToFirebase === 'function') {
                    window.saveWalletToFirebase(wallet.account.address);
                }
            } else {
                if (statusLabel) statusLabel.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
                if (detailsBox) detailsBox.style.display = 'none';
                localStorage.removeItem('user_wallet');
            }
        });
    } catch (e) {
        console.error("TON Initialization Failed:", e);
    }
}

// بەستنەوە بە دوگمەی سەرەکی خوارەوەی ئەپەکە
const originalSwitchPage = window.switchPage;
window.switchPage = function(pageId, element) {
    if (typeof originalSwitchPage === 'function') {
        originalSwitchPage(pageId, element);
    }
    if (pageId === 'wallet') {
        loadWalletUI();
    }
};

// لۆدکردنی یەکەمجار
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadWalletUI);
} else {
    loadWalletUI();
}
