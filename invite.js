// فەرمانێک بۆ خوێندنەوەی ژمارەی ئینڤایتەکان لە سێرڤەرە ئۆنلاینەکە
async function checkInviteStatus(userId) {
    try {
        // فەرمانێک بۆ خوێندنەوەی ژمارەی ئینڤایتەکان لە سێرڤەرە ئۆنلاینەکە
async function checkInviteStatus(userId) {
    try {
        const response = await fetch(`https://railway.app{userId}`);
        const data = await response.json();
        
        console.log("Data received:", data);
        
        // ئەگەر نوسینی ژمارەی ئینڤایتەکان لە ناو HTML هەیە، لێرەدا نوێ دەبێتەوە
        if (document.getElementById("inviteCount")) {
            document.getElementById("inviteCount").innerText = data.inviteCount;
        }
        // ئەگەر نوسینی باڵانسی کۆینەکان لە ناو HTML هەیە، لێرەدا نوێ دەبێتەوە
        if (document.getElementById("balance")) {
            document.getElementById("balance").innerText = data.balance;
        }
    } catch (error) {
        console.error("Connection error:", error);
    }
}
        const data = await response.json();
        
        console.log("Data received:", data);
        
        // ئەگەر نوسینی ژمارەی ئینڤایتەکان لە ناو HTML هەیە، لێرەدا نوێ دەبێتەوە
        if (document.getElementById("inviteCount")) {
            document.getElementById("inviteCount").innerText = data.inviteCount;
        }
        // ئەگەر نوسینی باڵانسی کۆینەکان لە ناو HTML هەیە، لێرەدا نوێ دەبێتەوە
        if (document.getElementById("balance")) {
            document.getElementById("balance").innerText = data.balance;
        }
    } catch (error) {
        console.error("Connection error:", error);
    }
}
