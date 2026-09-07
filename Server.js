const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "Server is running smoothly!" });
});

app.post('/api/wallet/connect', (req, res) => {
    const { walletAddress, telegramId } = req.body;
    console.log(User ${telegramId} connected wallet: ${walletAddress});
    res.json({ success: true, message: "Wallet data received" });
});

app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
