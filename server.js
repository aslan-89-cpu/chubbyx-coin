const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Bot Configuration
const token = '7479707324:AAF1J41IX5YBZMk1L2RNMPSQUOS8T';
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(cors());
app.use(express.json());

const CHANNEL_ID = '@chubbyx_coin';
const dbPath = path.join(__dirname, 'database.json');

// Safely read and write user data using local JSON file
function readDB() {
    try {
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data || '{}');
    } catch (e) {
        console.error("Database read error:", e);
        return {};
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Database write error:", e);
    }
}

// 1. Endpoint triggered when user joins via Bot / Referral link
app.post('/api/start-bot', (req, res) => {
    const { userId, username, refererId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "No User ID" });

    const uId = String(userId);
    const refId = refererId ? String(refererId) : null;
    let usersDatabase = readDB();

    if (!usersDatabase[uId]) {
        usersDatabase[uId] = { balance: 1000, inviteCount: 0, referredBy: refId };

        if (refId && usersDatabase[refId]) {
            if (usersDatabase[refId].inviteCount < 20) {
                usersDatabase[refId].balance += 3000; 
                usersDatabase[refId].inviteCount += 1;
                bot.sendMessage(refId, "🎉 A friend joined using your link! You received +3000 coins.");
            } else {
                usersDatabase[refId].inviteCount += 1;
            }
        }
        writeDB(usersDatabase);
        bot.sendMessage(uId, "Welcome to ChubbyX! Start earning now!");
        return res.json({ success: true, message: "Registered successfully." });
    }
    return res.json({ success: true, message: "User already exists." });
});

// 2. Endpoint for Daily Lucky Spin (Fixed static calculation to eliminate syntax error crashes)
app.post('/api/spin', (req, res) => {
    const { userId } = req.body;
    const uId = String(userId);
    let usersDatabase = readDB();

    if (!usersDatabase[uId]) return res.json({ success: false, message: "Please register first." });

    const now = Date.now();
    const lastSpin = usersDatabase[uId].lastSpinTime || 0;
    const cooldown = 24 * 60 * 60 * 1000; 

    if (now - lastSpin < cooldown) {
        const hoursLeft = Math.ceil((cooldown - (now - lastSpin)) / (1000 * 60 * 60));
        return res.json({ success: false, message: Come back later! Spin available in ${hoursLeft} hours. });
    }

    // Static array options strictly handled to prevent empty assignment errors
    const prizeOptions =;
    const finalReward = prizeOptions[Math.floor(Math.random() * prizeOptions.length)];

    usersDatabase[uId].balance += finalReward;
    usersDatabase[uId].lastSpinTime = now;
    writeDB(usersDatabase);

    return res.json({ success: true, reward: finalReward });
});

// 3. Endpoint to fetch user stats safely
app.get('/api/user-stats', (req, res) => {
    const { userId } = req.query;
    const uId = String(userId);
    let usersDatabase = readDB();

    if (usersDatabase[uId]) {
        return res.json({ success: true, inviteCount: usersDatabase[uId].inviteCount, balance: usersDatabase[uId].balance });
    }
    return res.json({ success: true, inviteCount: 0, balance: 0 });
});

// 4. Endpoint to sync tapping scores and mini-game data
app.post('/api/save-score', (req, res) => {
    const { userId, score } = req.body;
    const uId = String(userId);
    let usersDatabase = readDB();

    if (usersDatabase[uId] && score > 0) {
        usersDatabase[uId].balance += Number(score);
        writeDB(usersDatabase);
        return res.json({ success: true, newBalance: usersDatabase[uId].balance });
    }
    return res.json({ success: false, message: "Failed to update profile balance." });
});

// 5. Endpoint to verify Telegram channel joining task
app.post('/api/verify-channel', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "No User ID." });

    try {
        const chatMember = await bot.getChatMember(CHANNEL_ID, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(chatMember.status);
        
        if (isMember) {
            const uId = String(userId);
            let usersDatabase = readDB();
            if (usersDatabase[uId]) {
                usersDatabase[uId].balance += 5000;
                writeDB(usersDatabase);
            }
            return res.json({ success: true, message: "Task completed! Reward granted." });
        }
        return res.json({ success: false, message: "You must join the channel first." });
    } catch (error) {
        return res.json({ success: false, message: "Verification endpoint connection failed." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Backend server strictly active on port ${PORT}));
