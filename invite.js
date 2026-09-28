const invitesPage = document.getElementById('invites-page');

if (invitesPage) {
    // هێنانی ژمارەی هاوڕێکان و سکیورتی کلێم لە لۆکاڵ ستۆریج (ئەگەر نەبوو 0 دەبێت)
    let invitesCount = parseInt(localStorage.getItem('chubby_invites_count')) || 0;
    let claimedMilestone = localStorage.getItem('chubby_claimed_milestone') || 'none';

    // حیسابکردنی بڕی خەڵات بەپێی مەرجەکانی تۆ
    let rewardAmount = 0;
    let tierText = "No reward available";

    if (invitesCount >= 1 && invitesCount < 5) {
        rewardAmount = 3000;
        tierText = "Tier 1: 3,000 Coins";
    } else if (invitesCount >= 5 && invitesCount < 10) {
        rewardAmount = 10000;
        tierText = "Tier 2: 10,000 Coins";
    } else if (invitesCount >= 10 && invitesCount < 20) {
        rewardAmount = 20000;
        tierText = "Tier 3: 20,000 Coins";
    } else if (invitesCount >= 20) {
        rewardAmount = 50000;
        tierText = "Max Tier: 50,000 Coins";
    }

    // پشکنینی ئەوەی ئایا پێشتر ئەم تاقمە خەڵاتەی وەرگرتووە یان نا
    let isClaimable = invitesCount > 0 && claimedMilestone !== tierText;
    let buttonStatus = isClaimable ? "" : "disabled style='background: #555; color: #aaa; cursor: not-allowed; box-shadow: none;'";
    let buttonLabel = claimedMilestone === tierText ? "Claimed ✓" : "Claim Reward";

    invitesPage.innerHTML = `
        <h2 class="page-title">Invite Friends</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
            <div style="background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; width: 100%; max-width: 320px; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #aaa; margin-bottom: 5px;">Total Invited Friends</div>
                <div style="font-size: 36px; font-weight: bold; color: #eeb308;" id="ref-count">${invitesCount}</div>
            </div>

            <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 15px; width: 100%; max-width: 320px; text-align: left; margin-bottom: 25px; font-size: 14px; line-height: 1.6;">
                <div style="font-weight: bold; color: #eeb308; margin-bottom: 8px;">Referral Milestones:</div>
                <div style="display:flex; justify-content:space-between;"><span>1 - 4 Friends:</span> <span>3,000 Coins</span></div>
                <div style="display:flex; justify-content:space-between;"><span>5 - 9 Friends:</span> <span>10,000 Coins</span></div>
                <div style="display:flex; justify-content:space-between;"><span>10 - 19 Friends:</span> <span>20,000 Coins</span></div>
                <div style="display:flex; justify-content:space-between;"><span>20+ Friends:</span> <span>50,000 Coins</span></div>
            </div>

            <div style="color: #aaa; font-size: 14px; margin-bottom: 15px;">Available Reward: <b style="color: #fff;">${tierText}</b></div>

            <!-- دوگمەی وەرگرتنی خەڵات کە ناچالاکە ئەگەر مەرجەکە جێبەجێ نەبێت -->
            <button id="claim-ref-btn" ${buttonStatus} style="background: #eeb308; color: black; border: none; padding: 14px 24px; border-radius: 12px; font-weight: bold; font-size: 16px; width: 100%; max-width: 280px; cursor: pointer; box-shadow: 0 4px 15px rgba(238, 179, 8, 0.2); margin-bottom: 15px;">
                ${buttonLabel}
            </button>

            <!-- دوگمەی بانگهێشتکردنی هاوڕێ نوێ بەستراوە بە مینی ئەپی تێلێگرامەوە -->
            <button id="invite-friend-btn" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 12px 20px; border-radius: 12px; font-weight: bold; font-size: 15px; width: 100%; max-width: 280px; cursor: pointer;">
                🔗 Invite a Friend
            </button>
        </div>
        <!-- دوگمەی جێگیری گەڕانەوە بۆ ماڵەوە -->
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 200px; margin-top: auto; padding: 12px;">Back to Home</button>
    `;

    // کرداری کلیک لەسەر وەرگرتنی خەڵات
    document.getElementById('claim-ref-btn').addEventListener('click', function() {
        if (rewardAmount > 0) {
            let currentCoins = parseInt(localStorage.getItem('chubby_coins')) || 0;
            currentCoins += rewardAmount;
            localStorage.setItem('chubby_coins', currentCoins);
            localStorage.setItem('chubby_claimed_milestone', tierText);
            
            // ئەپدەیتکردنەوەی سکۆری سەر شاشەی سەرەکی
            document.getElementById('main-score').innerText = currentCoins.toLocaleString();
            
            alert("Success! You claimed " + rewardAmount.toLocaleString() + " CHUBBYX coins.");
            switchPage('home');
        }
    });

    // کرداری دروستکردنی لۆژیکی بەستەری تێلێگرام بۆ بانگهێشت
    document.getElementById('invite-friend-btn').addEventListener('click', function() {
        // تێبینی: لێرەدا دەتوانیت لینکی فەرمی بۆتەکەت دابنێیت کاتێک بڵاوت کردەوە
        let botUrl = "https://t.me"; 
        let text = "Join me on ChubbyX and earn together!";
        let shareUrl = "https://t.me" + encodeURIComponent(botUrl) + "&text=" + encodeURIComponent(text);
        
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openTelegramLink(shareUrl);
        } else {
            window.open(shareUrl, '_blank');
        }
    });
}
