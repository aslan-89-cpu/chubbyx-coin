// ChubbyX Independent Airdrop System
document.addEventListener("DOMContentLoaded", () => {
    const airdropView = document.getElementById("airdrop-view");
    if (!airdropView) return;

    airdropView.innerHTML = `
        <h2 class="view-title">Airdrop Listing 🎁</h2>
        <p class="view-desc" style="max-width: 320px;">The ChubbyX Token airdrop will be distributed based on your total balance and completed tasks. Stay tuned for listing dates!</p>
        
        <div class="custom-card" style="border-color: #ffd666;">
            <span>Current Status</span>
            <span style="color:#ffd666; font-weight:bold;">Snapshot Pending</span>
        </div>
        <div class="custom-card">
            <span>Minimum Requirements</span>
            <span style="color:#ccc;">100K Coins</span>
        </div>
    `;
});
