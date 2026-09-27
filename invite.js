//  Referral and Invite System with Progressive Rewards
function getInviteReward(invitecount) {
    if (invitecount >= 1 && invitecount < 5) {
        return 5000; // 1 to 5 invites = 5000 coins each
    } else if (invitecount >= 5 && invitecount < 10) {
        return 12000; // 5 to 10 invites = 12000 coins each
    } else if (invitecount >= 10 && invitecount < 20) {
        return 20000; // 10 to 20 invites = 20000 coins each
    } else if (invitecount >= 20) {
        return 50000; // 20 and above = 50000 coins each
    }
    return 5000; // Default reward
}

// // Function to simulate tracking and claiming referral rewards locally
function simulateNewInvite() {
    // Track total invites locally for testing
    let totalInvites = parseInt(localStorage.getItem('chubby_total_invites')) || 0;
    totalInvites += 1;
    localStorage.setItem('chubby_total_invites', totalInvites);

    // Calculate reward based on current invite count tier
    let rewardAmount = getInviteReward(totalInvites);

    // Add reward to total balance
    let currentScore = parseInt(localStorage.getItem('chubby_score')) || 0;
    currentScore += rewardAmount;
    localStorage.setItem('chubby_score', currentScore);

    // Update score text on screen
    if (document.getElementById('score')) {
        document.getElementById('score').innerText = currentScore;
    }

    alert(Success! Friend #${totalInvites} joined. You earned +${rewardAmount.toLocaleString()} coins! 🚀);
}

// // Main function to copy the bot invite link to clipboard
function copyInviteLink() {
    const botUsername = "Your_bot_username"; // لێرەدا ناوی بۆتەکەت بنووسە لە جیاتی ئەمە
    const inviteLink = https://t.me{botUsername}/game;

    navigator.clipboard.writeText(inviteLink).then(() => {
        alert("Your unique invite link copied to clipboard! Share it with friends.");
        
        // بۆ تاقیکردنەوە، کاتێک لینکەکە کۆپی دەکەیت، لێرەدا بە شێوازی لۆکاڵی وەک ئەوە وایە کەسێک جۆینی کردبێت
        simulateNewInvite();
    }).catch(err => {
        console.error('Could not copy link: ', err);
    });
}

// بەستنەوەی فەرمانی کۆپیکردن بەو دوگمەیەی لە ناو index.html داتناوە
document.addEventListener("DOMContentLoaded", () => {
    const inviteBtn = document.getElementById("invite-btn");
    if (inviteBtn) {
        inviteBtn.addEventListener("click", copyInviteLink);
    }
});
