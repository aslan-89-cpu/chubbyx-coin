const walletPage = document.getElementById('wallet-page');

if (walletPage) {
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <p style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">Connect your TON wallet to participate in the future airdrop distribution.</p>
            <button id="connect-wallet-btn" style="background: #0098ea; color: white; border: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0, 152, 234, 0.3);">
                💎 Connect TON Wallet
            </button>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 200px; margin-top: 20px; padding: 12px;">Back to Home</button>
    `;

    document.getElementById('connect-wallet-btn').addEventListener('click', () => {
        alert('TonConnect integration coming soon!');
    });
}
