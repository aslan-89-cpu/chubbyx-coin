// ChubbyX Wallet Dynamic Logic
document.addEventListener("DOMContentLoaded", () => {
    const walletActionBtn = document.getElementById("wallet-action-btn");
    
    if (walletActionBtn) {
        // پشکنین ئەگەر پێشتر جزدان بەسترابێت
        const savedWallet = localStorage.getItem('user_wallet_address');
        if (savedWallet) {
            walletActionBtn.innerText = ✅ Connected: ${savedWallet};
            walletActionBtn.style.background = "#a0e670";
        }

        walletActionBtn.addEventListener("click", () => {
            const currentWallet = localStorage.getItem('user_wallet_address');
            
            if (currentWallet) {
                if (confirm("Do you want to disconnect your wallet?")) {
                    localStorage.removeItem('user_wallet_address');
                    walletActionBtn.innerText = "💎 Connect TON Wallet";
                    walletActionBtn.style.background = "white";
                    alert("Wallet disconnected.");
                }
                return;
            }

            // دروستکردنی ناونیشانی جزدانی تاقیکاری
            const mockAddress = "EQA1k8O_vX..." + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem('user_wallet_address', mockAddress);
            
            walletActionBtn.innerText = ✅ Connected: ${mockAddress};
            walletActionBtn.style.background = "#a0e670";
            alert("Wallet connected successfully! 🚀");
        });
    }
});
