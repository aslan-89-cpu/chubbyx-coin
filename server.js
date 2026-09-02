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
let usersDatabase = {}; 

// 1. Start Bot API
app.post('/api/start-bot', (req, res) => {
    const { userId, username, refererId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required." });

    const uId = String(userId);
    const refId = refererId ? String(refererId) : null;

    if (!usersDatabase[uId]) {
        usersDatabase[uId] = { balance: 1000, inviteCount: 0, referredBy: refId };

        if (refId && usersDatabase[refId]) {
            if (usersDatabase[refId].inviteCount < 20) {
                usersDatabase[refId].balance += 3000; 
                usersDatabase[refId].inviteCount += 1;
                bot.sendMessage(refId, 🎉 A friend joined! You got +3000 coins.);
            } else {
                usersDatabase[refId].inviteCount += 1;
            }
        }
        bot.sendMessage(uId, Welcome to ChubbyX! Start earning now!);
        return res.json({ success: true, message: "Registered." });
    }
    return res.json({ success: true, message: "Exists." });
});

// 2. Daily Lucky Spin API
app.post('/api/spin', (req, res) => {
    const { userId } = req.body;
    const uId = String(userId);

    if (!usersDatabase[uId]) return res.json({ success: false, message: "Register first." });

    const now = Date.now();
    const lastSpin = usersDatabase[uId].lastSpinTime || 0;
    const cooldown = 24 * 60 * 60 * 1000; 

    if (now - lastSpin < cooldown) {
        const hoursLeft = Math.ceil((cooldown - (now - lastSpin)) / (1000 * 60 * 60));
        return res.json({ success: false, message: Try again in ${hoursLeft} hours. });
    }

    // Direct numbers to prevent syntax errors
    const randomReward = [100, 250, 500, 1000, 2000, 5000][Math.floor(Math.random() * 6)];

    usersDatabase[uId].balance += randomReward;
    usersDatabase[uId].lastSpinTime = now;

    return res.json({ success: true, reward: randomReward });
});

// 3. User Stats API
app.get('/api/user-stats', (req, res) => {
    const { userId } = req.query;
    const uId = String(userId);
    if (usersDatabase[uId]) {
        return res.json({ success: true, inviteCount: usersDatabase[uId].inviteCount, balance: usersDatabase[uId].balance });
    }
    return res.json({ success: true, inviteCount: 0, balance: 0 });
});

// 4. Save Score API
app.post('/api/save-score', (req, res) => {
    const { userId, score } = req.body;
    const uId = String(userId);
    if (usersDatabase[uId] && score > 0) {
        usersDatabase[uId].balance += Number(score);
        return res.json({ success: true, newBalance: usersDatabase[uId].balance });
    }
    return res.json({ success: false, message: "Error." });
});

// 5. Verify Channel API
app.post('/api/verify-channel', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "No User ID." });

    try {
        const chatMember = await bot.getChatMember(CHANNEL_ID, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(chatMember.status);
        if (isMember) {
            const uId = String(userId);
            if (usersDatabase[uId]) usersDatabase[uId].balance += 5000;
            return res.json({ success: true, message: "Verified!" });
        }
        return res.json({ success: false, message: "Not a member." });
    } catch (error) {
        return res.json({ success: false, message: "Failed." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Running on ${PORT}));
