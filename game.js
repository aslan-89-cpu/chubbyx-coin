if (window.Telegram && window.Telegram.WebApp) {
    const webApp = window.Telegram.WebApp;
    webApp.ready();
    webApp.expand();
}

document.addEventListener("DOMContentLoaded", () => {
    
    const backElements = document.querySelectorAll('#back-btn, .back-btn, [href="index.html"]');
    backElements.forEach(element => {
        element.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "index.html";
        });
    });

    const coinButton = document.getElementById("coin") || 
                       document.getElementById("coin-btn") || 
                       document.querySelector(".coin") || 
                       document.querySelector(".clicker-btn") ||
                       document.querySelector("img[src*='coin']");

    const scoreDisplay = document.getElementById("score") || 
                         document.getElementById("balance") || 
                         document.querySelector(".score");

    let score = parseInt(localStorage.getItem("coin_score")) || 0;
    
    if (scoreDisplay) {
        scoreDisplay.innerText = score;
    }

    if (coinButton) {
        coinButton.style.cursor = "pointer";
        coinButton.style.transition = "transform 0.1s ease";

        coinButton.addEventListener("click", (e) => {
            score += 1;
            
            if (scoreDisplay) {
                scoreDisplay.innerText = score;
            }

            localStorage.setItem("coin_score", score);

            coinButton.style.transform = "scale(0.95)";
            setTimeout(() => {
                coinButton.style.transform = "scale(1)";
            }, 100);

            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
        });
    }
});
