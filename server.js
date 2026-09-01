const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// تۆکنی بۆتەکەت
const token = '7479707324:AAF1J41IX5Y8Z9MK1L2RNMPSQUOSBT';
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(cors());
app.use(express.json());

// یوزەرنەیمی فەرمی چەناڵەکەت
const CHANNEL_ID = '@chubbyx_coin';

// داتابەیسی کاتی بۆ پاشەکەوتکردنی زانیارییەکان
let usersDatabase = {};

// ١. ئەپی ئای پشکنینی جۆینبوونی کەناڵ
app.post('/api/verify-channel', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.json({ success: false, message: "ناسنامەی بەکارهێنەر نەدۆزرایەوە." });
    }

    try {
        const member = await bot.getChatMember(CHANNEL_ID, userId);
        const status = member.status;

        if (['member', 'administrator', 'creator'].includes(status)) {
            return res.json({ success: true, message: "بەکارهێنەر ئەندامە." });
        } else {
            return res.json({ success: false, message: "تکایە سەرەتا جۆینی کەناڵەکە ببە." });
        }
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "هەڵەیەک ڕوویدا لە کاتی پشکنین." });
    }
});

// ٢. ئەپی ئای تۆمارکردنی ئینڤایت کاتێک بەکارهێنەر بۆتەکە Start دەکات
app.post('/api/start-bot', (req, res) => {
    const { userId, referrerId } = req.body;

    if (!userId) {
        return res.json({ success: false, message: "userId پێویستە" });
    }

    // ئەگەر بەکارهێنەرەکە نوێ بێت
    if (!usersDatabase[userId]) {
        usersDatabase[userId] = { balance: 0, inviteCount: 0, invitedBy: referrerId || null };

        // ئەگەر لەڕێگەی لینکی کەسێکی ترەوە هاتبێت
        if (referrerId && usersDatabase[referrerId] && referrerId !== userId) {
            let referrer = usersDatabase[referrerId];
            
            // پشکنین بۆ ئەوەی لە ٢٠ هاوڕێ زیاتر نەبێت
            if (referrer.inviteCount < 20) {
                referrer.inviteCount += 1;
                referrer.balance += 3000; // پێدانی ٣٠٠٠ کۆین بۆ کەسی داوەتکار
            }
        }
        return res.json({ success: true, message: "بەکارهێنەری نوێ تۆمارکرا و خەڵاتەکە درا." });
    }

    return res.json({ success: true, message: "ئەم بەکارهێنەرە پێشتر تۆمارکراوە." });
});

// ٣. ئەپی ئای ناردنی داتای ئینڤایت بۆ فایلی invite.html
app.get('/api/invite-status', (req, res) => {
    const { userId } = req.query;
    const user = usersDatabase[userId] || { inviteCount: 0, balance: 0 };
    res.json({ inviteCount: user.inviteCount, balance: user.balance });
});

// لێدانی فەرمانی /start لە ناو تێلیگرام بۆ خوێندنەوەی لینکی ئینڤایت
bot.onText(/\/start ?(.*)/, (msg, match) => {
    const userId = msg.from.id;
    const startParam = match[1]; // بەشی پاشگری لینکەکە دەخوێنێتەوە (بۆ نموونە ref_12345)

    let referrerId = null;
    if (startParam && startParam.startsWith('ref_')) {
        referrerId = startParam.split('_')[1];
    }

    // لێرەدا بەکارهێنەرەکە لە داتابەیسی سێرڤەرەکەدا تۆمار دەکەین
    if (!usersDatabase[userId]) {
        usersDatabase[userId] = { balance: 0, inviteCount: 0, invitedBy: referrerId || null };
        
        if (referrerId && usersDatabase[referrerId] && referrerId !== String(userId)) {
            let referrer = usersDatabase[referrerId];
            if (referrer.inviteCount < 20) {
                referrer.inviteCount += 1;
                referrer.balance += 3000;
            }
        }
    }

    bot.sendMessage(userId, "بەخێرهاتی بۆ بۆتی ChubbyX! ئێستا دەتوانیت مینی ئەپەکە بکەیتەوە.");
});

app.listen(3000, () => console.log('سێرڤەرەکە کاردەکات لەسەر پۆرتی 3000'));
