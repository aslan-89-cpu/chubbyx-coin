// Referral and Invite System with Progressive Rewards
function getInviteReward(inviteCount) {
    if (inviteCount >= 1 && inviteCount < 5) {
        return 3000; // 1 to 5 invites = 3000 coins each
    } else if (inviteCount >= 5 && inviteCount < 10) {
        return 8000; // 5 to 10 invites = 8000 coins each
    } else if (inviteCount >= 10 && inviteCount < 20) {
        return 15000; // 10 to 20 invites = 15000 coins each
    } else if (inviteCount >= 20) {
        return 30000; // 20 and above = 30000 coins each
    }
    return 3000; // Default reward
}

// Function to simulate tracking and claiming referral rewards locally
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

    alert(Success! Friend #${totalInvites} joined. You earned +${rewardAmount.toLocaleString()} Coins! 🎉);
}

// Main function to copy the bot invite link to clipboard
function copyInviteLink() {
    const botUsername = "your_bot_username"; // ناوی بۆتەکەت لێرە بنووسە کاتێک لە BotFather دروستی دەکەیت
    const inviteLink = https://t.me{botUsername}/game;

    navigator.clipboard.writeText(inviteLink).then(() => {
        alert("Your unique invite link copied to clipboard! Share it with friends.");
        
        // For testing/simulation, we trigger a successful referral reward
        simulateNewInvite();
    }).catch(err => {
        console.error('Could not copy link: ', err);
    });
}
