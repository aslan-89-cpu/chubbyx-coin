const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ڕێگەدان بە گواستنەوەی داتاکان بەبێ کێشەی CORS
app.use(cors());
app.use(express.json());

// پیشاندانی فایلە ستاتیکەکانی وەک index.html و مینی گەیمەکان
app.use(express.static(path.join(__dirname)));

// ڕێڕەوێکی سادە بۆ تاقیکردنەوەی سێرڤەرەکە
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "Server is running smoothly!" });
});

// لێرەدا لە داهاتوودا هاوکێشەی کڕینی قۆناغ بە قۆناغی TON جێگیر دەکەین
app.post('/api/wallet/connect', (req, res) => {
    const { walletAddress, telegramId } = req.body;
    console.log(User ${telegramId} connected wallet: ${walletAddress});
    res.json({ success: true, message: "Wallet data received" });
});

app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
