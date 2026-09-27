 // Wallet Connection System (Modular UI & Logic inside wallet.js)

document.addEventListener("DOMContentLoaded", () => {
    // ١. دۆزینەوەی بەشی جزدان لە ناو index.html
    const walletTab = document.getElementById("wallet");
    if (!walletTab) return;

    // ٢. دروستکردنی دیزاینی گرافیکی بە تەواوی لە ناو ئەم فایلەدا (بەبێ دەستکاریکردنی index.html)
    walletTab.innerHTML = `
        <button class="btn-top btn-back-home" onclick="returnToHome()">⬅️ Back to home</button>
        <h2 class="tab-title">Connect TON Wallet 💎</h2>
        <p class="tab-desc" style="color:#ccc; margin-bottom:20px;">Connect your TON wallet to receive your ChubbyX Airdrop rewards!</p>
        
        <div id="ton-connect-btn" style="background:white; color:black; padding:15px 30px; border-radius:15px; cursor:pointer; font-weight:bold; font-size:16px; box-shadow: 0 4px 10px rgba(255,255,255,0.1); transition: all 0.2s ease;">
            💎 Connect TON Wallet
        </div>
    `;

    // ٣. چالاککردنی فەرمانی کلیک و لۆجیکی جزدانەکە
    const walletBtn = document.getElementById("ton-connect-btn");
    if (walletBtn) {
        walletBtn.addEventListener("click", () => {
            const savedWallet = localStorage.getItem('user_wallet_address');
            
            if (savedWallet) {
                if (confirm("Do you want to disconnect your wallet?")) {
                    localStorage.removeItem('user_wallet_address');
                    updateWalletUI(null);
                    alert("Wallet disconnected.");
                }
                return;
            }

            // دروستکردنی ناونیشانی جزدانی تاقیکاری
            const mockWalletAddress = "EQA1k8O_vX..." + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem('user_wallet_address', mockWalletAddress);
            updateWalletUI(mockWalletAddress);
            alert("Wallet connected successfully! 🚀");
        });
    }

    // پشکنین ئەگەر پێشتر جزدان بەسترابوو لە کاتی باربوونی ئەپەکەدا
    const savedWallet = localStorage.getItem('user_wallet_address');
    if (savedWallet) {
        updateWalletUI(savedWallet);
    }
});

// فەرمانی گۆڕینی شێوازی دوگمەکە لە کاتی بەستندا
function updateWalletUI(walletAddress) {
    const walletBtn = document.getElementById("ton-connect-btn");
    if (walletBtn) {
        if (walletAddress) {
            walletBtn.innerText = ✅ Connected: ${walletAddress};
            walletBtn.style.background = "#a0e670"; 
            walletBtn.style.color = "#000";
        } else {
            walletBtn.innerText = "💎 Connect TON Wallet";
            walletBtn.style.background = "white";
            walletBtn.style.color = "black";
        }
    }
}
