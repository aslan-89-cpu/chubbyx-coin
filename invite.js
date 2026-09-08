// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Production Server URL
const serverurl = window.location.origin;
const botusername = "Chubbyx_Coin_bot";

const userid = tg.initDataUnsafe?.user?.id || 0;

function shareinviteLink() {
    if (!userid) {
        alert("User data not found. Please open via Telegram.");
        return;
    }
    
    const invitelink = https://t.me{botusername}/app?startapp=r_${userid};
    const shareurl = https://t.me{encodeURIComponent(invitelink)}&text=${encodeURIComponent("Join ChubbyX and earn coins! 🚀")};
    
    tg.openTelegramLink(shareurl);
}

async function checkinvitestatus() {
    if (!userid) return;
    
    try {
        const response = await fetch(${serverurl}/api/user-stats?userId=${userid});
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

// Automatically load invite status when the page is ready
document.addEventListener("DOMContentLoaded", checkinvitestatus);
