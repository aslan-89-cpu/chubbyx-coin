const gamesPage = document.getElementById('games-page');

if (gamesPage) {
    gamesPage.innerHTML = `
        <h2 class="page-title">Mini Games</h2>
        <div class="page-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <p style="color: #ccc; font-size: 15px;">New arcade mini games are under development.</p>
            <span style="font-size: 40px; margin-top: 15px;">🚧</span>
        </div>
        <button class="btn-top" onclick="switchPage('home')" style="width: 100%; max-width: 200px; margin-top: 20px; padding: 12px;">Back to Home</button>
    `;
}
