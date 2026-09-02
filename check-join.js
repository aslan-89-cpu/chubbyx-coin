const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');

// Replace this with your actual bot token from BotFather
const token = 'YOUR_BOT_TOKEN_HERE'; 
const bot = new TelegramBot(token);

router.post('/check-membership', async (req, res) => {
    const { userId } = req.body;
    const channelId = '@ChubbyXCoinOfficial';

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const member = await bot.getChatMember(channelId, userId);
        const isMember = ['member', 'administrator', 'creator'].includes(member.status);
        
        return res.json({ isMember: isMember });
    } catch (error) {
        console.error("Error checking channel membership:", error);
        // Fallback to true if there is an API error, so the game doesn't completely break
        return res.json({ isMember: true }); 
    }
});

module.exports = router;
