
/* =========================================
   CHUBBYX GAMES
   Daily Spin + VIP Spin
   Server-backed coin balances
   Preserves existing balances
========================================= */

(function () {
    "use strict";

    const API =
        "https://chubbyx-server.aslan89aslan1.workers.dev";

    const tg = window.Telegram?.WebApp || null;

    const NORMAL_PRIZES = [
        0, 5000, 0, 10000, 5000, 15000
    ];

    // Duplicate rewards are deliberately separated.
    const VIP_PRIZES = [
        25000, 50000, 25000, 75000, 50000, 100000
    ];

    let spinning = false;
    let spinTimeout = null;

    function setBalance(value) {
        const coins = Number(value);

        if (!Number.isSafeInteger(coins) || coins < 0) {
            return;
        }

        // Display cache only. Never reset the server balance.
        localStorage.setItem("chubby_coins", String(coins));

        const score = document.getElementById("main-score");

        if (score) {
            score.textContent = coins.toLocaleString();
        }
    }

    async function apiPost(endpoint, extra = {}) {
        if (!tg || !tg.initData) {
            throw new Error(
                "Please reopen ChubbyX from Telegram."
            );
        }

        const response = await fetch(API + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                initData: tg.initData,
                ...extra
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
            const error = new Error(
                data.message ||
                data.error ||
                "Server request failed."
            );

            error.status = response.status;
            error.data = data;

            throw error;
        }

        return data;
    }

    function showMessage(message, isError = false) {
        const element =
            document.getElementById("cx-game-message");

        if (!element) return;

        element.textContent = message;
        element.style.color =
            isError ? "#ff8a8a" : "#eeb308";
    }

    async function syncBalance() {
        try {
            const data = await apiPost("/api/me");
            const coins = Number(data.coins);

            if (
                Number.isSafeInteger(coins) &&
                coins >= 0
            ) {
                setBalance(coins);

                showMessage(
                    "Your balance: " +
                    coins.toLocaleString() +
                    " coins"
                );
            }
        } catch (error) {
            console.error(
                "ChubbyX balance sync failed:",
                error
            );

            showMessage(
                error.message ||
                "Could not sync your balance.",
                true
            );
        }
    }

    function makeWheel(id, prizes) {
        const labels = prizes.map((prize, index) => {
            const angle = index * 60 + 30;

            return `
                <div style="
                    position:absolute;
                    left:50%;
                    top:50%;
                    width:76px;
                    margin-left:-38px;
                    margin-top:-12px;
                    text-align:center;
                    color:${prize === 0 ? "#ffffff" : "#130f26"};
                    font-weight:900;
                    font-size:${prize >= 10000 ? "10px" : "12px"};
                    text-shadow:${prize === 0
                        ? "0 1px 2px #000"
                        : "0 1px 1px #ffffff55"};
                    transform:
                        rotate(${angle}deg)
                        translateY(-66px)
                        rotate(${-angle}deg);
                    pointer-events:none;
                ">${prize.toLocaleString()}</div>
            `;
        }).join("");

        return `
            <div style="
                position:relative;
                width:190px;
                height:190px;
                margin:22px auto;
            ">
                <div style="
                    position:absolute;
                    z-index:2;
                    top:-13px;
                    left:50%;
                    transform:translateX(-50%);
                    width:0;
                    height:0;
                    border-left:12px solid transparent;
                    border-right:12px solid transparent;
                    border-top:25px solid #f8d66d;
                    filter:drop-shadow(0 2px 3px #000);
                "></div>

                <div id="${id}" style="
                    position:relative;
                    width:190px;
                    height:190px;
                    border-radius:50%;
                    background:conic-gradient(
                        #eeb308 0deg 60deg,
                        #211a3b 60deg 120deg,
                        #eeb308 120deg 180deg,
                        #211a3b 180deg 240deg,
                        #eeb308 240deg 300deg,
                        #211a3b 300deg 360deg
                    );
                    border:5px solid #f8d66d;
                    box-sizing:border-box;
                    box-shadow:0 0 22px #eeb30833;
                    transition:
                        transform 2.5s cubic-bezier(.15,.7,.15,1);
                ">
                    ${labels}

                    <div style="
                        position:absolute;
                        left:50%;
                        top:50%;
                        transform:translate(-50%,-50%);
                        width:44px;
                        height:44px;
                        border-radius:50%;
                        background:#130f26;
                        border:3px solid #eeb308;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:22px;
                        z-index:1;
                    ">🐹</div>
                </div>
            </div>
        `;
    }

    function render() {
        const page = document.getElementById("games-page");

        if (!page) return;

        const saved = localStorage.getItem("chubby_coins");
        const parsed = saved === null ? NaN : Number(saved);

        const initialBalance =
            Number.isSafeInteger(parsed) && parsed >= 0
                ? parsed
                : null;

        page.innerHTML = `
            <h2 class="page-title">🎮 ChubbyX Games</h2>

            <div class="page-content">

                <div class="cx-card">
                    <h3>🎰 Daily Spin</h3>

                    <p>
                        Spin once per day for a chance to win
                        up to 15,000 coins.
                    </p>

                    ${makeWheel("cx-spin-wheel", NORMAL_PRIZES)}

                    <button class="cx-btn" id="cx-spin-button">
                        SPIN NOW
                    </button>

                    <div
                        class="cx-message"
                        id="cx-game-message"
                        aria-live="polite"
                    >
                        ${initialBalance === null
                            ? "Loading your server balance..."
                            : "Your balance: " +
                              initialBalance.toLocaleString() +
                              " coins"}
                    </div>
                </div>

                <div class="cx-card">
                    <h3>👑 VIP Spin</h3>

                    <p>
                        Win VIP rewards from 25,000 up to
                        100,000 coins.
                    </p>

                    ${makeWheel("cx-vip-wheel", VIP_PRIZES)}

                    <p style="font-size:13px;line-height:1.7">
                        First spin: <strong>0.25 TON</strong><br>
                        Each repeat: add <strong>0.05 TON</strong>
                        to the previous price.
                    </p>

                    <button class="cx-btn" id="cx-vip-spin-button">
                        VIP SPIN
                    </button>

                    <div style="
                        margin-top:10px;
                        font-size:12px;
                        opacity:.85;
                    ">
                        VIP rewards are unavailable until
                        server-side TON payment verification
                        is implemented.
                    </div>
                </div>

            </div>
        `;

        document
            .getElementById("cx-spin-button")
            .addEventListener("click", normalSpin);

        document
            .getElementById("cx-vip-spin-button")
            .addEventListener("click", vipSpin);

        syncBalance();
    }

    async function runSpin(
        endpoint,
        buttonId,
        wheelId,
        prizes,
        isVip
    ) {
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
            // The server determines the reward and balance.
            const data = await apiPost(endpoint);

            const reward = Number(data.reward);
            const coins = Number(data.coins);

            if (
                !Number.isSafeInteger(reward) ||
                !prizes.includes(reward) ||
                !Number.isSafeInteger(coins) ||
                coins < 0
            ) {
                throw new Error(
                    "The server returned an invalid spin result."
                );
            }

            setBalance(coins);

            const matchingIndexes = [];

            prizes.forEach((value, index) => {
                if (value === reward) {
                    matchingIndexes.push(index);
                }
            });

            const index = matchingIndexes[
                Math.floor(Math.random() * matchingIndexes.length)
            ];

            const degrees =
                360 * 5 + (360 - (index * 60 + 30));

            wheel.style.transform =
                "rotate(" + degrees + "deg)";

            button.textContent = "SPINNING...";

            if (spinTimeout) {
                window.clearTimeout(spinTimeout);
            }

            spinTimeout = window.setTimeout(() => {
                showMessage(
                    (isVip ? "VIP Spin: " : "You won ") +
                    reward.toLocaleString() +
                    " coins!"
                );
            }, 2500);

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
                showMessage(
                    "You have already spun today. Try again tomorrow.",
                    true
                );
            } else if (error.status === 501 && isVip) {
                showMessage(
                    "VIP payment verification is not configured. No VIP reward was added.",
                    true
                );
            } else {
                showMessage(
                    error.message || "Spin failed. Please try again.",
                    true
                );
            }

            wheel.style.transform = "rotate(0deg)";

        } finally {
            window.setTimeout(() => {
                spinning = false;

                const currentButton =
                    document.getElementById(buttonId);

                if (currentButton) {
                    currentButton.disabled = false;
                    currentButton.textContent =
                        isVip ? "VIP SPIN" : "SPIN NOW";
                }
            }, 2600);
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
        // The current Worker deliberately returns 501
        // until secure TON payment verification is implemented.
        return runSpin(
            "/api/vip-spin",
            "cx-vip-spin-button",
            "cx-vip-wheel",
            VIP_PRIZES,
            true
        );
    }

    window.gamePage = render;
    window.renderGame = render;
})();
