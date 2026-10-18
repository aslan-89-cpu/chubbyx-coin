
/* =========================================
   CHUBBYX GAMES
   Daily Spin + VIP Spin
   Purple / Black 3D Wheel
   Six aligned prize segments
   Server-backed balance
========================================= */

(function () {
    "use strict";

    const API = "https://chubbyx-server.aslan89aslan1.workers.dev";
    const tg = window.Telegram?.WebApp || null;

    const NORMAL_PRIZES = [0, 5000, 0, 10000, 5000, 15000];
    const VIP_PRIZES = [25000, 50000, 25000, 75000, 50000, 100000];

    const COLORS = {
        purple: "#A78BFA",
        lightPurple: "#D9C5FF",
        darkPurple: "#24143D",
        black: "#0B0714",
        white: "#FAF7FF",
        muted: "#CFC3E8",
        red: "#FF8585"
    };

    let spinning = false;
    let renderVersion = 0;
    let spinTimeout = null;

    /* ---------- SERVER BALANCE ---------- */

    function setBalance(value) {
        const coins = Number(value);

        if (!Number.isSafeInteger(coins) || coins < 0) {
            return;
        }

        // Save only a valid balance returned by the server.
        localStorage.setItem("chubby_coins", String(coins));

        const score = document.getElementById("main-score");
        if (score) {
            score.textContent = coins.toLocaleString();
        }

        const balance = document.getElementById("cx-balance");
        if (balance) {
            balance.textContent =
                "Your balance: " + coins.toLocaleString() + " coins";
        }

        const status = document.getElementById("cx-game-message");
        if (status && !spinning) {
            status.textContent =
                "Your balance: " + coins.toLocaleString() + " coins";
        }
    }

    async function apiPost(endpoint, extra = {}) {
        if (!tg || !tg.initData) {
            throw new Error("Please reopen ChubbyX from Telegram.");
        }

        const response = await fetch(API + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                initData: tg.initData,
                ...extra
            })
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

    function showMessage(message, isError = false) {
        const element = document.getElementById("cx-game-message");
        if (!element) return;

        element.textContent = message;
        element.style.color = isError ? COLORS.red : COLORS.lightPurple;
    }

    async function syncBalance() {
        try {
            const data = await apiPost("/api/me");
            const coins = Number(data.coins);

            if (Number.isSafeInteger(coins) && coins >= 0) {
                setBalance(coins);
            }
        } catch (error) {
            console.error("ChubbyX balance sync failed:", error);
            showMessage(
                error.message || "Could not sync your balance.",
                true
            );
        }
    }

    /* ---------- SIX WHEEL SEGMENTS ---------- */

    function makeWheel(id, prizes) {
        const labels = prizes.map((prize, index) => {
            const angle = index * 60;

            return `
                <div class="cx-wheel-label"
                     style="transform:rotate(${angle}deg) translateY(-72px) rotate(-${angle}deg)">
                    ${prize.toLocaleString()}
                </div>
            `;
        }).join("");

        return `
            <div class="cx-wheel-wrap">
                <div class="cx-pointer"></div>

                <div id="${id}" class="cx-wheel">
                    ${labels}
                    <div class="cx-wheel-center">CHUBBYX</div>
                </div>
            </div>
        `;
    }

    /* ---------- DESIGN ---------- */

    function addStyles() {
        if (document.getElementById("cx-games-theme")) return;

        const style = document.createElement("style");
        style.id = "cx-games-theme";

        style.textContent = `
            #games-page {
                overflow-y: auto;
                overflow-x: hidden;
                color: ${COLORS.white};
                padding: 28px 14px 28px;
                scrollbar-width: thin;
                scrollbar-color: #6942A8 #130F26;
            }

            #games-page .page-title {
                color: ${COLORS.lightPurple} !important;
                text-align: center;
                font-size: 27px;
                font-weight: 900;
                margin: 12px 0 22px;
                text-shadow: 0 0 18px #A78BFA55;
            }

            #games-page .page-content {
                width: 100%;
                max-width: 480px;
                flex: none;
                margin: 0 auto;
                padding: 0 0 20px;
                overflow: visible;
            }

            #games-page .cx-card {
                width: 100%;
                padding: 22px 15px;
                margin: 0 0 20px;
                border-radius: 24px;
                text-align: center;
                background:
                    radial-gradient(circle at 50% 0%, #382451 0%, #171024 48%, #0B0714 100%);
                border: 1px solid #A78BFA65;
                box-shadow:
                    0 12px 32px #00000050,
                    inset 0 1px 0 #FFFFFF18;
            }

            #games-page .cx-card h3 {
                color: ${COLORS.white};
                font-size: 24px;
                font-weight: 900;
                margin: 2px 0 10px;
            }

            #games-page .cx-card p {
                color: ${COLORS.muted};
                font-size: 14px;
                line-height: 1.7;
                margin: 10px 0 14px;
            }

            #games-page .cx-wheel-wrap {
                position: relative;
                width: 250px;
                height: 250px;
                margin: 24px auto 26px;
                isolation: isolate;
            }

            #games-page .cx-wheel {
                position: relative;
                width: 230px;
                height: 230px;
                margin: 10px auto;
                box-sizing: border-box;
                overflow: hidden;
                border-radius: 50%;
                border: 5px solid #C4A7FF;
                background: conic-gradient(
                    from -30deg,
                    #6942A8 0deg 60deg,
                    #1A1028 60deg 120deg,
                    #8055C7 120deg 180deg,
                    #24143D 180deg 240deg,
                    #56338A 240deg 300deg,
                    #10091C 300deg 360deg
                );
                box-shadow:
                    0 0 0 4px #A78BFA25,
                    0 0 24px #A78BFA65,
                    inset 0 0 20px #00000075,
                    inset 0 3px 6px #FFFFFF30;
                transition: transform 3s cubic-bezier(.12,.72,.12,1);
                transform: rotate(0deg);
                will-change: transform;
            }

            #games-page .cx-wheel-label {
                position: absolute;
                z-index: 1;
                top: 50%;
                left: 50%;
                width: 92px;
                margin-left: -46px;
                margin-top: -10px;
                text-align: center;
                white-space: nowrap;
                font-size: 12px;
                font-weight: 1000;
                color: #FFFFFF;
                text-shadow:
                    0 2px 3px #000000,
                    0 0 5px #000000;
                pointer-events: none;
            }

            #games-page .cx-wheel-center {
                position: absolute;
                z-index: 4;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 72px;
                height: 72px;
                border-radius: 50%;
                box-sizing: border-box;
                border: 3px solid #D9C5FF;
                background: linear-gradient(145deg, #382451, #0B0714);
                box-shadow:
                    0 0 18px #A78BFA80,
                    inset 0 2px 5px #FFFFFF25;
                color: #FFFFFF;
                font-size: 10px;
                font-weight: 1000;
                letter-spacing: .6px;
                text-align: center;
                text-shadow: 0 0 8px #A78BFA;
                pointer-events: none;
            }

            #games-page .cx-pointer {
                position: absolute;
                z-index: 6;
                top: -1px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-top: 28px solid #E0CDFF;
                filter: drop-shadow(0 3px 5px #000A);
            }

            #games-page .cx-btn {
                display: block;
                width: 100%;
                min-height: 54px;
                padding: 14px 12px;
                margin: 16px 0 10px;
                border: 1px solid #FFFFFF25;
                border-radius: 15px;
                background: linear-gradient(110deg, #A78BFA, #6942A8);
                color: #FFFFFF;
                font-size: 17px;
                font-weight: 1000;
                letter-spacing: .4px;
                box-shadow: 0 6px 20px #A78BFA30;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            #games-page .cx-btn:active {
                transform: scale(.985);
            }

            #games-page .cx-btn:disabled {
                opacity: .6;
                cursor: wait;
            }

            #games-page #cx-vip-spin-button {
                background: linear-gradient(110deg, #E5D5FF, #9063D8);
                color: #190D2B;
            }

            #games-page #cx-back-home {
                display: block;
                width: 100%;
                min-height: 46px;
                margin: 0 0 18px;
                padding: 12px;
                border: 1px solid #A78BFA70;
                border-radius: 14px;
                color: ${COLORS.white};
                background: #24143D;
                font-size: 15px;
                font-weight: 800;
                cursor: pointer;
            }

            #games-page .cx-message {
                min-height: 24px;
                margin-top: 12px;
                font-size: 14px;
                line-height: 1.6;
                overflow-wrap: anywhere;
            }

            #games-page .cx-vip-note {
                margin-top: 12px;
                padding: 12px;
                border: 1px solid #A78BFA40;
                border-radius: 12px;
                background: #A78BFA0B;
                color: ${COLORS.muted};
                font-size: 12px;
                line-height: 1.7;
            }

            @media (max-width: 360px) {
                #games-page .cx-wheel-wrap {
                    transform: scale(.9);
                    margin-top: 12px;
                    margin-bottom: 12px;
                }

                #games-page .cx-card {
                    padding: 18px 10px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* ---------- NAVIGATION ---------- */

    function goHome() {
        if (typeof window.switchPage === "function") {
            window.switchPage("home");
            return;
        }

        const games = document.getElementById("games-page");
        const home = document.getElementById("home-layout");

        if (games) games.classList.remove("active");
        if (home) home.style.display = "flex";
    }

    /* ---------- RENDER PAGE EACH TIME IT OPENS ---------- */

    function render() {
        const page = document.getElementById("games-page");
        if (!page) return;

        renderVersion++;
        const thisRender = renderVersion;

        if (spinTimeout) {
            clearTimeout(spinTimeout);
            spinTimeout = null;
        }

        spinning = false;
        addStyles();

        const saved = localStorage.getItem("chubby_coins");
        const parsed = saved === null ? NaN : Number(saved);
        const initialBalance =
            Number.isSafeInteger(parsed) && parsed >= 0
                ? parsed
                : null;

        page.innerHTML = `
            <h2 class="page-title">🎮 ChubbyX Games</h2>

            <div class="page-content">
                <button id="cx-back-home" type="button">
                    ← Back to Home
                </button>

                <div class="cx-card">
                    <h3>🎰 Daily Spin</h3>
                    <p>Spin once per day for a chance to win up to 15,000 coins.</p>

                    ${makeWheel("cx-spin-wheel", NORMAL_PRIZES)}

                    <button class="cx-btn" id="cx-spin-button" type="button">
                        SPIN NOW
                    </button>

                    <div class="cx-message" id="cx-game-message" aria-live="polite">
                        ${
                            initialBalance === null
                                ? "Loading your server balance..."
                                : "Your balance: " + initialBalance.toLocaleString() + " coins"
                        }
                    </div>
                </div>

                <div class="cx-card">
                    <h3>👑 VIP Spin</h3>
                    <p>VIP rewards range from 25,000 up to 100,000 coins.</p>

                    ${makeWheel("cx-vip-wheel", VIP_PRIZES)}

                    <p>
                        First spin: <strong style="color:${COLORS.lightPurple}">0.25 TON</strong><br>
                        Each repeat adds <strong style="color:${COLORS.lightPurple}">0.05 TON</strong>.
                    </p>

                    <button class="cx-btn" id="cx-vip-spin-button" type="button">
                        VIP SPIN
                    </button>

                    <div class="cx-vip-note">
                        VIP rewards require server-side payment verification.
                        If the VIP endpoint is not activated on the server,
                        the button will show an error instead of awarding coins.
                    </div>
                </div>
            </div>
        `;

        document.getElementById("cx-back-home").addEventListener("click", goHome);
        document.getElementById("cx-spin-button").addEventListener("click", normalSpin);
        document.getElementById("cx-vip-spin-button").addEventListener("click", vipSpin);

        syncBalance().then(() => {
            if (thisRender !== renderVersion) return;
        });
    }

    /* ---------- SPIN LOGIC ---------- */

    async function runSpin(endpoint, buttonId, wheelId, prizes, isVip) {
        if (spinning) return;

        const button = document.getElementById(buttonId);
        const wheel = document.getElementById(wheelId);

        if (!button || !wheel) return;

        spinning = true;
        button.disabled = true;
        button.textContent = "CHECKING...";

        showMessage(
            isVip
                ? "Checking VIP payment verification..."
                : "Checking your daily spin..."
        );

        try {
            // The server decides the reward and balance.
            const data = await apiPost(endpoint);

            const reward = Number(data.reward);
            const coins = Number(data.coins);

            if (
                !Number.isSafeInteger(reward) ||
                !prizes.includes(reward) ||
                !Number.isSafeInteger(coins) ||
                coins < 0
            ) {
                throw new Error("The server returned an invalid spin result.");
            }

            setBalance(coins);

            // If a reward appears more than once, either matching segment is valid.
            const matchingIndexes = [];
            prizes.forEach((value, index) => {
                if (value === reward) matchingIndexes.push(index);
            });

            const index = matchingIndexes[
                Math.floor(Math.random() * matchingIndexes.length)
            ];

            // Segment zero is centered under the pointer at the top.
            // Each segment is exactly 60 degrees.
            const finalDegrees = (360 * 5) + (360 - index * 60);

            wheel.style.transform = "rotate(" + finalDegrees + "deg)";
            button.textContent = "SPINNING...";

            spinTimeout = window.setTimeout(() => {
                showMessage(
                    (isVip ? "VIP Spin: You won " : "You won ") +
                    reward.toLocaleString() +
                    " coins!"
                );

                spinning = false;

                const currentButton = document.getElementById(buttonId);
                if (currentButton) {
                    currentButton.disabled = false;
                    currentButton.textContent = isVip ? "VIP SPIN" : "SPIN NOW";
                }
            }, 3050);

        } catch (error) {
            console.error("ChubbyX spin failed:", error);

            if (
                error.data &&
                Number.isSafeInteger(Number(error.data.coins)) &&
                Number(error.data.coins) >= 0
            ) {
                setBalance(Number(error.data.coins));
            }

            if (error.status === 409 && !isVip) {
                showMessage("You have already spun today. Try again tomorrow.", true);
            } else if (isVip && (error.status === 501 || error.status === 404)) {
                showMessage(
                    "VIP Spin is not activated on the server yet. Payment verification is required.",
                    true
                );
            } else {
                showMessage(error.message || "Spin failed. Please try again.", true);
            }

            spinning = false;
            button.disabled = false;
            button.textContent = isVip ? "VIP SPIN" : "SPIN NOW";
        }
    }

    function normalSpin() {
        return runSpin(
            "/api/normal-spin",
            "cx-spin-button",
            "cx-spin-wheel",
            NORMAL_PRIZES,
            false
        );
    }

    function vipSpin() {
        return runSpin(
            "/api/vip-spin",
            "cx-vip-spin-button",
            "cx-vip-wheel",
            VIP_PRIZES,
            true
        );
    }

    // The index.html navigation calls this function each time Games opens.
    window.gamePage = render;
    window.renderGame = render;

})();
