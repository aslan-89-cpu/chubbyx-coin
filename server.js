const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const checkJoinRouter = require('./check-join');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', checkJoinRouter);
// Initialize Firebase
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}
const db = admin.firestore();

// Main home test route
app.get('/', (req, res) => {
    res.send("ChubbyX Web Server is officially running safely with Firebase! 🚀");
});

// Helper function to get or create user doc
async function getUserRef(userId) {
    const uId = String(userId || '0');
    const userRef = db.collection('users').doc(uId);
    const doc = await userRef.get();
    
    if (!doc.exists) {
        await userRef.set({
            balance: 1000,
            inviteCount: 0,
            lastCheckIn: null
        });
    }
    return userRef;
}

// 1. User Stats Route
app.get('/api/user-stats', async (req, res) => {
    try {
        const userRef = await getUserRef(req.query.userId);
        const doc = await userRef.get();
        const data = doc.data();
        res.json({ success: true, inviteCount: data.inviteCount, balance: data.balance });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// 2. Daily Lucky Spin Route
app.post('/api/spin', async (req, res) => {
    try {
        const userRef = await getUserRef(req.body.userId);
        const calculatedReward = 1000;
        await userRef.update({
            balance: admin.firestore.FieldValue.increment(calculatedReward)
        });
        res.json({ success: true, reward: calculatedReward });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// 3. Save Score Route
app.post('/api/save-score', async (req, res) => {
    try {
        const userRef = await getUserRef(req.body.userId);
        const scoreToAdd = Number(req.body.score || 0);
        await userRef.update({
            balance: admin.firestore.FieldValue.increment(scoreToAdd)
        });
        const doc = await userRef.get();
        res.json({ success: true, newBalance: doc.data().balance });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ⭐ NEW ENDPOINT 1: Daily Check-in
app.post('/api/daily-checkin', async (req, res) => {
    try {
        const userRef = await getUserRef(req.body.userId);
        const doc = await userRef.get();
        const data = doc.data();
        const now = new Date();
        
        if (data.lastCheckIn) {
            const lastCheckInDate = data.lastCheckIn.toDate();
            if (now.toDateString() === lastCheckInDate.toDateString()) {
                return res.json({ success: false, message: "You already checked in today!" });
            }
        }
        
        const reward = 500;
        await userRef.update({
            balance: admin.firestore.FieldValue.increment(reward),
            lastCheckIn: admin.firestore.Timestamp.fromDate(now)
        });
        
        res.json({ success: true, message: "Check-in successful!", reward: reward });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ⭐ NEW ENDPOINT 2: Leaderboard (Top 10 Players)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const snapshot = await db.collection('users').orderBy('balance', 'desc').limit(10).get();
        let leaderboard = [];
        snapshot.forEach(doc => {
            leaderboard.push({ userId: doc.id, ...doc.data() });
        });
        res.json({ success: true, leaderboard: leaderboard });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ⭐ NEW ENDPOINT 3: Complete Social Tasks
app.post('/api/tasks', async (req, res) => {
    try {
        const { userId, taskId } = req.body;
        const userRef = await getUserRef(userId);
        let reward = 2000;
        await userRef.update({
            balance: admin.firestore.FieldValue.increment(reward)
        });
        res.json({ success: true, message: "Task " + taskId + " completed!", reward: reward });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/start-bot', (req, res) => { res.json({ success: true, message: "Registered." }); });
app.post('/api/verify-channel', (req, res) => { res.json({ success: true, message: "Verified!" }); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running safely on port " + PORT);
});
