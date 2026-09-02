const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// Bot Configuration
const token = '7479707324:AAF1J41IX5YBZMk1L2RNMPSQUOS8T';
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(cors());
app.use(express.json());

const CHANNEL_ID = '@chubbyx_coin';
let usersDatabase = {}; // In-memory database

// 1. Endpoint triggered ONLY when the new user actually enters/registers in the app
app.post('/api/start-bot', (req, res) => {
    const { userId, username, refererId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const uId = String(userId);
    const refId = refererId ? String(refererId) : null;

    // Check if this is a completely NEW user joining for the first time
    if (!usersDatabase[uId]) {
        usersDatabase[uId] = {
            balance: 1000, // New user gets 1000 coins for successfully entering
            inviteCount: 0,
            referredBy: refId
        };

        // ONLY reward the inviter if the new user successfully entered the app
        if (refId && usersDatabase[refId]) {
            // Check if inviter has less than 20 invites
            if (usersDatabase[refId].inviteCount < 20) {
                usersDatabase[refId].balance += 3000; // Inviter gets 3000 coins now
                usersDatabase[refId].inviteCount += 1;
                
                // Send alert to inviter that their friend successfully joined
                bot.sendMessage(refId, 🎉 A friend successfully joined using your link! You received +3000 coins.);
            } else {
                // If they have 20+ invites, just increment the count but don't give coins
                usersDatabase[refId].inviteCount += 1;
            }
        }

        bot.sendMessage(uId, Welcome to ChubbyX! Start earning now!);
        return res.json({ success: true, message: "New user entered. Rewards processed successfully." });
    }

    // If the user already exists, no rewards are given again
    return res.json({ success: true, message: "User already registered." });
});

// 2. Endpoint to fetch invite stats for invite.js
app.get('/api/user-stats', (req, res) => {
    const { userId } = req.query;
    const uId = String(userId);

    if (usersDatabase[uId]) {
        return res.json({
            success: true,
            inviteCount: usersDatabase[uId].inviteCount,
            balance: usersDatabase[uId].balance
        });
    } else {
        return res.json({ success: true, inviteCount: 0, balance: 0 });
    }
});

// 3. Verify Channel Join API
app.post('/api/verify-channel', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID not found." });
    }

    try {
        const chatMember = await bot.getChatMember(CHANNEL_ID, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(chatMember.status);

        if (isMember) {
            const uId = String(userId);
            if (usersDatabase[uId]) {
                usersDatabase[uId].balance += 5000;
            }
            return res.json({ success: true, message: "Successfully verified! Reward granted." });
        } else {
            return res.json({ success: false, message: "You haven't joined the channel yet." });
        }
    } catch (error) {
        console.error("Channel verification error:", error);
        return res.json({ success: false, message: "Verification failed. Try again later." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
