const menuPage = document.getElementById('menu-page');

if (menuPage) {
    menuPage.innerHTML = `
        <h2 class="page-title">Menu</h2>
        <div class="page-content">
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 10px;">
                <div style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 16px; cursor: pointer;">📜 About Project</div>
                <div style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 16px; cursor: pointer;">⚙️ Game Settings</div>
                <div style="padding: 15px; font-size: 16px; cursor: pointer;">📢 Join Community</div>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 200px; margin-top: 20px; padding: 12px;">Back to Home</button>
    `;
}
