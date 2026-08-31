const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// تۆکنی بۆتەکەت
const token = '7479707324:AAFi3-M2J3X5Y8Z9W0K1L2M3N4P5Q6R7S8T'; 
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(cors());
app.use(express.json());

// یوزەرنەیمی فەرمی چەناڵەکەت
const CHANNEL_ID = '@chubbyx_coin'; 

// ڕێڕەوی پشکنینی جۆینبوونی چەناڵ
app.post('/api/verify-channel', async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        return res.json({ success: false, message: 'ناسنامەی بەکارهێنەر نەدۆزرایەوە' });
    }
    
    try {
        const member = await bot.getChatMember(CHANNEL_ID, userId);
        
        if (['member', 'administrator', 'creator'].includes(member.status)) {
            return res.json({ success: true, message: 'بەکارهێنەر جۆین بووە' });
        } else {
            return res.json({ success: false, message: 'تکایە سەرەتا جۆینی چەناڵەکە ببە' });
        }
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: 'تکایە دڵنیابەوە کە سەرەتا جۆین بوویت' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));
