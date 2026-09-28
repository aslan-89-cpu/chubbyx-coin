(function() {
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            
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

    const customBtn = document.getElementById('custom-ton-connect-btn');
    if (customBtn) {
        customBtn.addEventListener('click', function() {
            const event = new CustomEvent('triggerTonConnect');
            window.dispatchEvent(event);
        });
    }
})();
