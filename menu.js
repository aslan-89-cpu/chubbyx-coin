// ChubbyX Independent Menu System
document.addEventListener("DOMContentLoaded", () => {
    // دۆزینەوەی بەشی مینوو لە ناو فایلی سەرەکی index.html
    const menuView = document.getElementById("menu-view");
    if (!menuView) return;

    // دروستکردنی ڕووکاری گرافیکی مینوو بە تەواوی لە ناو ئەم فایلەدا
    menuView.innerHTML = `
        <h2 class="view-title">Menu Options ☰</h2>
        <p class="view-desc">Configure your settings or play secondary games.</p>
        
        <div class="custom-card" id="menu-lucky-wheel">
            <span>🎰 Lucky Wheel Spin</span>
            <span style="color:#a0e670; font-weight:bold;">Play</span>
        </div>
        <div class="custom-card" id="menu-shop">
            <span>🛒 Item Shop</span>
            <span style="color:#ffd666; font-weight:bold;">Open</span>
        </div>
        <div class="custom-card" id="menu-music">
            <span>🎵 Game Music</span>
            <span style="color:#0088cc; font-weight:bold;">ON</span>
        </div>
    `;

    // بەستنەوەی فەرمانی کلیک بە دوگمە نوێیەکانی ناو مینوو
    
    // کاتێک کلیک لەسەر Lucky Wheel دەکەن، دەیانباتە بەشی Games
    document.getElementById("menu-lucky-wheel").addEventListener("click", () => { 
        if (typeof navigateTo === "function") {
            navigateTo('games'); 
        } else {
            alert("Navigating to Games...");
        }
    });

    // کلیک لەسەر دوکان (Shop)
    document.getElementById("menu-shop").addEventListener("click", () => { 
        alert("Shop feature is coming soon! 🛒"); 
    });

    // کلیک لەسەر مۆسیقا
    document.getElementById("menu-music").addEventListener("click", () => { 
        alert("Sound settings updated! 🎵"); 
    });
});
