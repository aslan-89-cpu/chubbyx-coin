const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// Bot Configuration
const token = '7479707324:AAF1J41IX5YBZMk1L2RNMPSQUOS8T';
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(cors());
app.use(express.json());

const CHANNEL_ID = '@chubbyx_coin';

// Test endpoint to ensure server responds
app.get('/', (req, res) => {
    res.send("ChubbyX Backend is Running Safely!");
});

// 1. Basic User Stats API
app.get('/api/user-stats', (req, res) => {
    res.json({ success: true, inviteCount: 0, balance: 1000 });
});

// 2. Basic Spin API
app.post('/api/spin', (req, res) => {
    res.json({ success: true, reward: 1000 });
});

// 3. Basic Save Score API
app.post('/api/save-score', (req, res) => {
    res.json({ success: true, newBalance: 1500 });
});

// 4. Basic Start Bot API
app.post('/api/start-bot', (req, res) => {
    res.json({ success: true, message: "Registered." });
});

// 5. Basic Verify Channel API
app.post('/api/verify-channel', (req, res) => {
    res.json({ success: true, message: "Verified!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server strictly active on port ${PORT}));
