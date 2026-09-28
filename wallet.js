(function() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            <div id="ton-connect-btn-container" style="margin-bottom: 20px;"></div>
            <div id="wallet-info" style="display: none; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 260px; word-break: break-all; font-size: 13px; color: #aaa; margin-top: 10px;">
                <span style="color: #eeb308; font-weight: bold; display: block; margin-bottom: 5px;">Connected Wallet:</span>
                <span id="wallet-address"></span>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: auto; padding: 12px; margin-bottom: 100px;">Back to Home</button>
    `;

    // دەستپێکردنی کارکردنی TonConnect UI لەسەر دوگمەی ناو ئەم فایلە
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'tonconnect-manifest.json',
        buttonRootId: 'ton-connect-btn-container'
    });

    tonConnectUI.onStatusChange(wallet => {
        const statusText = document.getElementById('wallet-status-text');
        const walletInfo = document.getElementById('wallet-info');
        const walletAddress = document.getElementById('wallet-address');

        if (!statusText) return;

        if (wallet) {
            statusText.innerText = "Your TON wallet is successfully connected!";
            walletInfo.style.display = 'block';
            const rawAddress = wallet.account.address;
            walletAddress.innerText = rawAddress.substring(0, 6) + "..." + rawAddress.substring(rawAddress.length - 6);
        } else {
            statusText.innerText = "Connect your TON wallet to participate in the future airdrop distribution.";
            walletInfo.style.display = 'none';
        }
    });
})();
