const express = require('express');
const router = express.Router();

// Mock database simulation (Replace with your actual Firebase/MongoDB setup if you have one)
// This object tracks who invited whom and prevents double claiming
const referralData = {}; 
const userBalances = {}; 

router.post('/handle-login', async (req, res) => {
    const { userId, startParam } = req.body; // startParam contains "ref_12345"

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Initialize current user balance if not exists
    if (!userBalances[userId]) userBalances[userId] = 0;

    // Check if the user entered the bot via a referral link (e.g., ref_67890)
    if (startParam && startParam.startsWith('ref_')) {
        const inviterId = startParam.replace('ref_', '');

        // Secure Check: A user cannot invite themselves, and can only be invited once
        if (inviterId !== userId && !referralData[userId]) {
            // Record that this user was successfully invited by inviterId
            referralData[userId] = inviterId;

            // Initialize inviter balance if not exists
            if (!userBalances[inviterId]) userBalances[inviterId] = 0;

            // Reward the inviter with 3,000 coins because the friend successfully entered the game!
            const rewardAmount = 3000;
            userBalances[inviterId] += rewardAmount;

            console.log(Success: User ${userId} joined. Inviter ${inviterId} rewarded with +${rewardAmount} coins.);
            
            return res.json({ 
                success: true, 
                message: 'Referral processed successfully',
                inviterReward: rewardAmount 
            });
        }
    }

    return res.json({ success: true, message: 'Standard login processed' });
});

module.exports = router;
