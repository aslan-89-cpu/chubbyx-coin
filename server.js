const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// database memory structure 
let usersDatabase = {};

// Main home test route
app.get('/', (req, res) => {
    res.send("ChubbyX Web Server is officially running safely! 🚀");
});

// 1. User Stats Route
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

// 2. Daily Lucky Spin Route - Pure numbers to prevent any bracket errors
app.post('/api/spin', (req, res) => {
    const { userId } = req.body;
    const uId = String(userId || '0');
    
    if (!usersDatabase[uId]) usersDatabase[uId] = { balance: 1000, inviteCount: 0 };
    
    const calculatedReward = 1000; 
    usersDatabase[uId].balance += calculatedReward;
    
    res.json({ success: true, reward: calculatedReward });
});

// 3. Save Score Route
app.post('/api/save-score', (req, res) => {
    const { userId, score } = req.body;
    const uId = String(userId || '0');
    
    if (!usersDatabase[uId]) usersDatabase[uId] = { balance: 1000, inviteCount: 0 };
    
    usersDatabase[uId].balance += Number(score || 0);
    
    res.json({ success: true, newBalance: usersDatabase[uId].balance });
});

// 4. Start Bot Endpoint
app.post('/api/start-bot', (req, res) => {
    res.json({ success: true, message: "Registered." });
});

// 5. Verify Channel Endpoint
app.post('/api/verify-channel', (req, res) => {
    res.json({ success: true, message: "Verified!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(Server running safely on port ${PORT});
});
