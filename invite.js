// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Production Server URL
const serverUrl = "https://railway.app";
const botUsername = "ChubbyX_Coin_bot";

const userId = tg.initDataUnsafe?.user?.id || 0;

function shareInviteLink() {
    if (!userId) {
        alert("User data not found. Please open via Telegram.");
        return;
    }
    const inviteLink = https://t.me{botUsername}/app?startapp=${userId};
    const shareUrl = https://t.me{encodeURIComponent(inviteLink)}&text=${encodeURIComponent("Join ChubbyX and earn coins! 🚀")};
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
        }
    } catch (error) {
        console.error("Error fetching invite status:", error);
    }
}

// کاتێک لاپەڕەکە لۆد دەبێت، ئۆتۆماتیکی خاڵەکان لە سێرڤەرەوە دەخوێنێتەوە
document.addEventListener("DOMContentLoaded", checkInviteStatus);
