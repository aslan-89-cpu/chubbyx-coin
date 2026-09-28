const gamesPage = document.getElementById('games-page');

if (gamesPage) {
    gamesPage.innerHTML = `
        <h2 class="page-title">Mini Games</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
            <div style="font-size: 60px; margin-bottom: 15px; animation: pulse 2s infinite;">🎮</div>
            <h3 style="color: #eeb308; margin-bottom: 10px; font-size: 20px;">Arcade Coming Soon</h3>
            <p style="color: #ccc; font-size: 14px; max-width: 240px; line-height: 1.5; margin-bottom: 30px;">We are developing exciting mini-games where you can play and multiply your $CHUBBYX.</p>
            
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; width: 100%; max-width: 280px; border: 1px dashed rgba(255,255,255,0.1);">
                <span style="color: #aaa; font-size: 13px;">Next Update Status:</span>
                <div style="font-weight: bold; margin-top: 5px; color: #fff;">Under Construction 🚧</div>
            </div>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 200px; margin-top: auto; padding: 12px;">Back to Home</button>
    `;
}
