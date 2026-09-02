const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Fake database structure to keep frontend working smoothly
let usersDatabase = {};

// Test route to see if online
app.get('/', (req, res) => {
    res.send("ChubbyX Safe Server is completely Online! 🚀");
});

// 1. User Stats API
app.get('/api/user-stats', (req, res) => {
    const { userId } = req.query;
    const uId = String(userId || '0');
    
    if (!usersDatabase[uId]) {
        usersDatabase[uId] = { balance: 1000, inviteCount: 0 };
    }
    
    res.json({
        success: true,
        inviteCount: usersDatabase[uId].inviteCount,
        balance: usersDatabase[uId].balance
    });
});

// 2. Daily Lucky Spin API
app.post('/api/spin', (req, res) => {
    const { userId } = req.body;
    const uId = String(userId || '0');
    
    if (!usersDatabase[uId]) usersDatabase[uId] = { balance: 1000, inviteCount: 0 };
    
    const finalReward = 1000;
    usersDatabase[uId].balance += finalReward;
    
    res.json({ success: true, reward: finalReward });
});

// 3. Save Score API
app.post('/api/save-score', (req, res) => {
    const { userId, score } = req.body;
    const uId = String(userId || '0');
    
    if (!usersDatabase[uId]) usersDatabase[uId] = { balance: 1000, inviteCount: 0 };
    
    usersDatabase[uId].balance += Number(score || 0);
    
    res.json({ success: true, newBalance: usersDatabase[uId].balance });
});

// 4. Start Bot API
app.post('/api/start-bot', (req, res) => {
    res.json({ success: true, message: "Registered." });
});

// 5. Verify Channel API
app.post('/api/verify-channel', (req, res) => {
    res.json({ success: true, message: "Verified!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server strictly active on port ${PORT}));
