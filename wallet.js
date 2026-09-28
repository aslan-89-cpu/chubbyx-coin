(function() {
    // Check if the wallet page container exists on the screen
    const walletPage = document.getElementById('wallet-page');
    if (!walletPage) return;

    // Render the layout elements cleanly in English inside its own file
    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <p id="wallet-status-text" style="color: #ccc; margin-bottom: 30px; max-width: 280px; font-size: 15px; line-height: 1.4;">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>
            <!-- The official blue TON Connect button container -->
            <div id="ton-connect-official-btn" style="margin-top: 20px; min-height: 44px;"></div>
            <button class="btn-top" onclick="if(typeof switchPage === 'function'){switchPage('home')}else{window.location.reload()}" style="width: 100%; max-width: 240px; margin-top: 40px; padding: 12px; z-index: 10;">Back to Home</button>
        </div>
    `;

    // Safe and loop-driven loading for the TonConnectUI global instance
    function mountTonConnectButton() {
        try {
            // Read from the global window elements loaded by index script
            const SDK = window.TonConnectUI || window.TON_CONNECT_UI;
            
            if (SDK) {
                // Initialize the official component directly into the placeholder div
                new SDK.TonConnectUI({
                    manifestUrl: 'https://github.io/chubbyx-coin/tonconnect-manifest.json',
                    buttonRootId: 'ton-connect-official-btn'
                });
                console.log("TON Connect button rendered successfully.");
            } else {
                // Retry in 200ms if the external SDK script is still booting up
                setTimeout(mountTonConnectButton, 200);
            }
        } catch (error) {
            console.error("Failed to mount TON Connect wallet button:", error);
        }
    }

    // Trigger the bootstrapper safely
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountTonConnectButton);
    } else {
        mountTonConnectButton();
    }
})();
