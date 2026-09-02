// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); 

// Get User ID from Telegram Context safely
const userId = tg.initDataUnsafe?.user?.id || 0;

// IMPORTANT: Change this to your real bot username without the '@'
const botUsername = "chubbyx_bot"; 

// Function to generate and open Telegram share link
function shareInviteLink() {
    if (!userId) {
        alert("User data not found. Please open via Telegram.");
        return;
    }
    const inviteLink = https://t.me{botUsername}/app?startapp=${userId};
    const shareUrl = https://t.me{encodeURIComponent(inviteLink)}&text=${encodeURIComponent("Join ChubbyX mini-app and earn +1000 free coins instantly! 🚀")};
    tg.openTelegramLink(shareUrl);
}

// Function to fetch referral data from backend server
async function checkInviteStatus() {
    if (!userId) return;

    try {
        // Fetch stats from your API route
        const response = await fetch(/api/user-stats?userId=${userId});
        const data = await response.json();

        console.log("Data received from server:", data);

        if (data.success) {
            // Update UI elements if they exist in HTML
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

// Auto-run when the screen loads
window.onload = function() {
    checkInviteStatus();
};
