// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); 

// Production Server URL
const serverUrl = "https://railway.app"; 
const botUsername = "chubbyx_coin_bot"; 

const userId = tg.initDataUnsafe?.user?.id || 0;

function shareInviteLink() {
    if (!userId) {
        alert("User data not found. Please open via Telegram.");
        return;
    }
    const inviteLink = https://t.me{botUsername}/app?startapp=${userId};
    const shareUrl = https://t.me{encodeURIComponent(inviteLink)}&text=${encodeURIComponent("Join ChubbyX mini-app and earn +1000 free coins instantly! 🚀")};
    tg.openTelegramLink(shareUrl);
}

async function checkInviteStatus() {
    if (!userId) return;

    try {
        const response = await fetch(${serverUrl}/api/user-stats?userId=${userId});
        const data = await response.json();

        if (data.success) {
            if (document.getElementById("inviteCount")) {
                document.getElementById("inviteCount").innerText = data.inviteCount;
            }
            if (document.getElementById("balance")) {
                document.getElementById("balance").innerText = data.balance;
            }
        }
    } catch (error) {
        console.error("Connection error fetching stats:", error);
    }
}

window.onload = function() {
    checkInviteStatus();
};
