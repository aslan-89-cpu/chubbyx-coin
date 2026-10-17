
/* CHUBBYX GAMES
   Server-backed daily spin.
   Does not reset or initialize the user's coin balance.
*/
(function () {
    "use strict";

    const API = "https://chubbyx-server.aslan89aslan1.workers.dev";
    const tg = window.Telegram?.WebApp || null;
    let spinning = false;

    function setBalance(value) {
        const coins = Number(value);
        if (!Number.isFinite(coins) || coins < 0) return;

        localStorage.setItem("chubby_coins", String(Math.floor(coins)));

        const score = document.getElementById("main-score");
        if (score) score.textContent = Math.floor(coins).toLocaleString();
    }

    async function apiPost(endpoint) {
        if (!tg || !tg.initData) {
            throw new Error("Open ChubbyX inside Telegram to play.");
        }

        const response = await fetch(API + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData: tg.initData })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
            const error = new Error(
                data.message || data.error || "Server request failed."
            );
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    function showMessage(text, error) {
        const element = document.getElementById("cx-game-message");
        if (!element) return;
        element.textContent = text;
        element.style.color = error ? "#ff8a8a" : "#eeb308";
    }

    async function syncBalance() {
        try {
            const data = await apiPost("/api/me");

            if (data.coins !== undefined && Number.isFinite(Number(data.coins))) {
                setBalance(data.coins);
                showMessage(
                    "Your balance: " + Number(data.coins).toLocaleString() + " coins",
                    false
                );
            }
        } catch (error) {
            console.error("ChubbyX balance sync failed:", error);
            showMessage(error.message || "Could not sync your balance.", true);
        }
    }

    function render() {
        const page = document.getElementById("games-page");
        if (!page) return;

        const stored = Number.parseInt(localStorage.getItem("chubby_coins") || "0", 10);
        const initialBalance = Number.isFinite(stored) && stored >= 0 ? stored : 0;

        page.innerHTML = `
            <h2 class="page-title">🎮 ChubbyX Games</h2>
            <div class="page-content">
                <div class="cx-card">
                    <h3>Daily Spin</h3>
                    <p>Spin once per day for a chance to win up to 15,000 coins.</p>

                    <div id="cx-spin-wheel"
                         style="width:190px;height:190px;border-radius:50%;margin:18px auto;
                         background:conic-gradient(#eeb308 0deg 60deg,#211a3b 60deg 120deg,
                         #eeb308 120deg 180deg,#211a3b 180deg 240deg,
                         #eeb308 240deg 300deg,#211a3b 300deg 360deg);
                         border:5px solid #f8d66d;display:flex;align-items:center;
                         justify-content:center;box-shadow:0 0 22px #eeb30833;
                         transition:transform 2.5s cubic-bezier(.15,.7,.15,1)">
                        <div style="width:78px;height:78px;border-radius:50%;
                        background:#130f26;border:3px solid #eeb308;display:flex;
                        align-items:center;justify-content:center;font-size:26px">🐹</div>
                    </div>

                    <button class="cx-btn" id="cx-spin-button">SPIN NOW</button>
                    <div class="cx-message" id="cx-game-message">
                        Your balance: ${initialBalance.toLocaleString()} coins
                    </div>
                </div>

                <div class="cx-card">
                    <h3>VIP Spin</h3>
                    <p>VIP Spin is not available yet.</p>
                    <button class="cx-btn" disabled>Coming Soon</button>
                </div>
            </div>`;

        document.getElementById("cx-spin-button").addEventListener("click", spin);
        syncBalance();
    }

    async function spin() {
        if (spinning) return;

        const button = document.getElementById("cx-spin-button");
        const wheel = document.getElementById("cx-spin-wheel");
        if (!button || !wheel) return;

        spinning = true;
        button.disabled = true;
        button.textContent = "SPINNING...";
        showMessage("Checking your daily spin...", false);

        try {
            const data = await apiPost("/api/normal-spin");

            if (data.coins !== undefined && Number.isFinite(Number(data.coins))) {
                setBalance(data.coins);
            }

            const reward = Number(data.reward || 0);
            const rewards = [0, 0, 5000, 5000, 10000, 15000];
            const index = Math.max(0, rewards.indexOf(reward));
            const degrees = 360 * 5 + (360 - (index * 60 + 30));

            wheel.style.transform = "rotate(" + degrees + "deg)";

            window.setTimeout(function () {
                showMessage(
                    "You won " + reward.toLocaleString() + " coins!",
                    false
                );
            }, 2500);
        } catch (error) {
            if (error.data && error.data.coins !== undefined) {
                setBalance(error.data.coins);
            }

            if (error.status === 409) {
                showMessage("You have already spun today. Try again tomorrow.", true);
            } else {
                showMessage(error.message || "Spin failed. Please try again.", true);
            }

            wheel.style.transform = "rotate(0deg)";
        } finally {
            window.setTimeout(function () {
                spinning = false;
                const currentButton = document.getElementById("cx-spin-button");
                if (currentButton) {
                    currentButton.disabled = false;
                    currentButton.textContent = "SPIN NOW";
                }
            }, 2600);
        }
    }

    window.gamePage = render;
    window.renderGame = render;
})();
