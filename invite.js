function updateInviteUI() {
    let invitesCount = parseInt(localStorage.getItem('chubby_invites_count')) || 0;
    let claimedMilestone = localStorage.getItem('chubby_claimed_milestone') || 'none';
    
    const countText = document.getElementById('ref-count-text');
    if(!countText) return;
    
    countText.innerText = invitesCount;

    let rewardAmount = 0;
    let tierText = "No reward available";

    if (invitesCount >= 1 && invitesCount < 5) { rewardAmount = 3000; tierText = "Tier 1: 3,000 Coins"; }
    else if (invitesCount >= 5 && invitesCount < 10) { rewardAmount = 10000; tierText = "Tier 2: 10,000 Coins"; }
    else if (invitesCount >= 10 && invitesCount < 20) { rewardAmount = 20000; tierText = "Tier 3: 20,000 Coins"; }
    else if (invitesCount >= 20) { rewardAmount = 50000; tierText = "Max Tier: 50,000 Coins"; }

    document.getElementById('reward-tier-text').innerText = tierText;
    let claimBtn = document.getElementById('claim-ref-btn');

    if (invitesCount > 0 && claimedMilestone !== tierText) {
        claimBtn.disabled = false;
        claimBtn.innerText = "Claim Reward";
        claimBtn.style.background = "#eeb308"; claimBtn.style.color = "black"; claimBtn.style.cursor = "pointer";
        
        claimBtn.onclick = function() {
            count += rewardAmount;
            document.getElementById('main-score').innerText = count.toLocaleString();
            localStorage.setItem('chubby_coins', count);
            localStorage.setItem('chubby_claimed_milestone', tierText);
            alert("Claimed " + rewardAmount.toLocaleString() + " Coins successfully!");
            updateInviteUI();
        };
    } else {
        claimBtn.disabled = true;
        claimBtn.style.background = "#444"; claimBtn.style.color = "#888"; claimBtn.style.cursor = "not-allowed";
        claimBtn.innerText = claimedMilestone === tierText ? "Claimed ✓" : "Claim Reward";
    }
}

// چاککردنی لۆژیکی ناردنی بەستەر بۆ ناو تێلێگرام
function shareInviteLink() {
    let text = encodeURIComponent("Join ChubbyX Hub and earn \$CHUBBYX together! 🚀");
    // بەکارهێنانی سیستەمی فەرمی تێلێگرام بۆ هاوبەشکردنی نامە
    let shareUrl = "https://t.me" + text;
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
        window.open(shareUrl, '_blank');
    }
}

(function() {
    const invitesPage = document.getElementById('invites-page');
    if (!invitesPage) return;

    invitesPage.innerHTML = `
        <h2 class="page-title">Invite Friends</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; align-items: center; max-height: calc(100vh - 220px); overflow-y: auto;">
            <div style="background: rgba(255,255,255,0.05); border-radius: 16px; padding: 15px 0; width: 100%; max-width: 300px; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #aaa; margin-bottom: 5px;">Total Invited Friends</div>
                <div style="font-size: 34px; font-weight: bold; color: #eeb308;" id="ref-count-text">0</div>
            </div>

            <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 15px; width: 100%; max-width: 300px; text-align: left; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
                <div style="font-weight: bold; color: #eeb308; margin-bottom: 6px;">Referral Milestones:</div>
                <div style="display:flex; justify-content:space-between;"><span>1 - 4 Friends:</span> <span>3,000 Coins</span></div>
                <div style="display:flex; justify-content:space-between;"><span>5 - 9 Friends:</span> <span>10,000 Coins</span></div>
                <div style="display:flex; justify-content:space-between;"><span>10 - 19 Friends:</span> <span>20,000 Coins</span></div>
                <div style="display:flex; justify-content:space-between;"><span>20+ Friends:</span> <span>50,000 Coins</span></div>
            </div>

            <p style="color: #aaa; font-size: 13px; margin-bottom: 15px;">Available Reward: <span id="reward-tier-text" style="color:#fff; font-weight:bold;">No reward available</span></p>
            <button id="claim-ref-btn" disabled style="background: #444; color: #888; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; font-size: 16px; width: 100%; max-width: 260px; cursor: not-allowed; margin-bottom: 12px;">Claim Reward</button>
            <button onclick="shareInviteLink()" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 12px 20px; border-radius: 12px; font-weight: bold; font-size: 15px; width: 100%; max-width: 260px; cursor: pointer;">🔗 Invite a Friend</button>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 240px; margin-top: 15px; padding: 12px; margin-bottom: 120px; z-index: 2000; position: relative;">Back to Home</button>
    `;
})();
