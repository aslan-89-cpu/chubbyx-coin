const API =
    "https://chubbyx-server.aslan89aslan1.workers.dev";

const tg = window.Telegram?.WebApp || null;

const NORMAL_PRIZES = [
    0, 5000, 0, 10000, 5000, 15000
];

const VIP_PRIZES = [
    25000, 50000, 25000, 75000, 50000, 100000
];

const COLORS = {
    gold: "#C4A7FF",
    blue: "#A78BFA",
    darkBlue: "#24143D",
    navy: "#0B0714",
    card: "#171024",
    white: "#FAF7FF",
    muted: "#CFC3E8",
    red: "#FF8585"
};

let spinning = false;
let spinTimeout = null;

/* ---------- SAFE BALANCE DISPLAY ---------- */

function setBalance(value) {
    const coins = Number(value);

    if (!Number.isSafeInteger(coins) || coins < 0) {
        return;
    }

    // Update the cache only with a valid server balance.
    localStorage.setItem("chubby_coins", String(coins));

    const score = document.getElementById("main-score");

    if (score) {
        score.textContent = coins.toLocaleString();
    }

    const balanceText = document.getElementById("cx-balance");

    if (balanceText) {
        balanceText.textContent =
            "Your balance: " + coins.toLocaleString() + " coins";
    }

    const message = document.getElementById("cx-game-message");

    if (message && !spinning) {
        message.textContent =
            "Your balance: " + coins.toLocaleString() + " coins";
    }
}

/* ---------- SERVER REQUEST ---------- */

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

/* ---------- MESSAGES ---------- */

function showMessage(message, isError = false) {
    const element =
        document.getElementById("cx-game-message");

    if (!element) return;

    element.textContent = message;
    element.style.color = isError
        ? COLORS.red
        : COLORS.blue;
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
        }
    } catch (error) {
        console.error("ChubbyX balance sync failed:", error);

        showMessage(
            error.message || "Could not sync your balance.",
            true
        );
    }
}

/* ---------- PURPLE 3D WHEEL ---------- */

function makeWheel(id, prizes) {
    const segments = prizes.map((prize, index) => {
        const angle = index * 60 + 30;

        return `
            <div class="cx-wheel-label" style="
                transform:
                    rotate(${angle}deg)
                    translateY(-68px)
                    rotate(${-angle}deg);
            ">
                ${prize.toLocaleString()}
            </div>
        `;
    }).join("");

    return `
        <div class="cx-wheel-wrap">
            <div class="cx-pointer"></div>

            <div id="${id}" class="cx-wheel">
                ${segments}

                <div class="cx-wheel-center">
                    CHUBBYX
                </div>
            </div>
        </div>
    `;
}

/* ---------- STYLES ---------- */

function addStyles() {
    if (document.getElementById("cx-games-theme")) return;

    const style = document.createElement("style");
    style.id = "cx-games-theme";

    style.textContent = `
        #games-page {
            color: ${COLORS.white};
            padding-bottom: 28px;
        }

        #games-page .page-title {
            color: ${COLORS.blue} !important;
            text-align: center;
            font-size: 27px;
            font-weight: 900;
            margin: 18px 0 20px;
            text-shadow: 0 0 18px #A78BFA45;
        }

        #games-page .page-content {
            width: 100%;
            max-width: 520px;
            margin: 0 auto;
            padding: 0 12px 22px;
            box-sizing: border-box;
        }

        #games-page .cx-card {
            box-sizing: border-box;
            width: 100%;
            padding: 22px 16px;
            margin: 0 0 20px;
            border-radius: 24px;
            text-align: center;
            color: ${COLORS.white};
            background:
                radial-gradient(
                    circle at top,
                    #382451 0%,
                    ${COLORS.card} 52%,
                    ${COLORS.navy} 100%
                );
            border: 1px solid #A78BFA50;
            box-shadow:
                0 12px 32px #00000045,
                inset 0 1px 0 #FFFFFF12;
        }

        #games-page .cx-card h3 {
            color: ${COLORS.white};
            font-size: 25px;
            font-weight: 900;
            margin: 2px 0 12px;
        }

        #games-page .cx-card p {
            color: ${COLORS.muted};
            font-size: 16px;
            line-height: 1.7;
            margin: 10px 0 18px;
        }

        #games-page .cx-wheel-wrap {
            position: relative;
            width: 240px;
            height: 240px;
            margin: 28px auto 30px;
            perspective: 800px;
        }

        #games-page .cx-wheel {
            position: relative;
            width: 220px;
            height: 220px;
            margin: 10px auto;
            box-sizing: border-box;
            overflow: hidden;
            border-radius: 50%;
            border: 5px solid #C4A7FF;
            background: conic-gradient(
                from -30deg,
                #56338A 0deg 60deg,
                #24143D 60deg 120deg,
                #8055C7 120deg 180deg,
                #170F28 180deg 240deg,
                #6942A8 240deg 300deg,
                #24143D 300deg 360deg
            );
            box-shadow:
                0 0 0 3px #A78BFA25,
                0 0 24px #A78BFA55,
                inset 0 0 20px #00000070,
                inset 0 3px 5px #FFFFFF25;
            transition:
                transform 2.8s cubic-bezier(.12,.72,.12,1);
            transform-style: preserve-3d;
        }

        #games-page .cx-wheel-label {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 92px;
            margin-left: -46px;
            margin-top: -11px;
            text-align: center;
            white-space: nowrap;
            font-size: 12px;
            font-weight: 1000;
            letter-spacing: .1px;
            color: #FFFFFF;
            -webkit-text-stroke: .2px #10091C;
            text-shadow:
                0 1px 3px #000000,
                0 0 5px #00000090;
            pointer-events: none;
        }

        #games-page .cx-wheel-center {
            position: absolute;
            z-index: 3;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 68px;
            height: 68px;
            box-sizing: border-box;
            border-radius: 50%;
            background: linear-gradient(145deg, #32204D, #0B0714);
            border: 3px solid #C4A7FF;
            box-shadow:
                0 0 16px #A78BFA70,
                inset 0 2px 5px #FFFFFF20;
            color: #FAF7FF;
            font-size: 11px;
            font-weight: 1000;
            letter-spacing: .5px;
            text-align: center;
            text-shadow: 0 0 8px #A78BFA80;
        }

        #games-page .cx-pointer {
            position: absolute;
            z-index: 5;
            top: -1px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 0;
            border-top: 28px solid #C4A7FF;
            filter: drop-shadow(0 3px 5px #0008);
        }

        #games-page .cx-btn {
            display: block;
            width: 100%;
            min-height: 56px;
            padding: 14px 12px;
            margin: 18px 0 10px;
            border: 1px solid #FFFFFF20;
            border-radius: 16px;
            background: linear-gradient(
                110deg,
                #A78BFA,
                #7448B8
            );
            color: #FFFFFF;
            font-size: 18px;
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
            opacity: .65;
            cursor: wait;
        }

        #games-page #cx-vip-spin-button {
            background: linear-gradient(
                110deg,
                #E5D5FF,
                #9063D8
            );
            color: #190D2B;
            box-shadow: 0 6px 20px #A78BFA30;
        }

        #games-page #cx-back-home {
            display: block;
            width: 100%;
            min-height: 48px;
            margin: 0 0 20px;
            padding: 12px;
            border: 1px solid #A78BFA70;
            border-radius: 14px;
            color: ${COLORS.white};
            background: #24143D;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
        }

        #games-page .cx-message {
            min-height: 24px;
            margin-top: 12px;
            color: ${COLORS.blue};
            font-size: 15px;
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
            font-size: 13px;
            line-height: 1.7;
        }

        @media (max-width: 360px) {
            #games-page .cx-wheel-wrap {
                transform: scale(.9);
                margin-top: 16px;
                margin-bottom: 16px;
            }

            #games-page .cx-card {
                padding: 18px 12px;
            }

            #games-page .cx-card h3 {
                font-size: 22px;
            }
        }
    `;

    document.head.appendChild(style);
}

/* ---------- BACK TO HOME ---------- */

function goHome() {
    const homeButton = document.querySelector(
        '[data-page="home"], [data-page="home-page"]'
    );

    if (homeButton) {
        homeButton.click();
        return;
    }

    const gamesPage = document.getElementById("games-page");
    const homePage =
        document.getElementById("home-page") ||
        document.getElementById("home-layout");

    if (gamesPage && homePage) {
        gamesPage.style.display = "none";
        homePage.style.display = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    if (typeof window.showPage === "function") {
        window.showPage("home");
        return;
    }

    showMessage(
        "Please use the Home button in the bottom navigation.",
        true
    );
}

/* ---------- RENDER GAMES PAGE ---------- */

function render() {
    const page = document.getElementById("games-page");
    if (!page) return;

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

                <p>
                    Spin once per day for a chance to win
                    up to 15,000 coins.
                </p>

                ${makeWheel("cx-spin-wheel", NORMAL_PRIZES)}

                <button
                    class="cx-btn"
                    id="cx-spin-button"
                    type="button"
                >
                    SPIN NOW
                </button>

                <div class="cx-message" id="cx-game-message"
                     aria-live="polite">
                    ${
                        initialBalance === null
                            ? "Loading your server balance..."
                            : "Your balance: " +
                              initialBalance.toLocaleString() +
                              " coins"
                    }
                </div>
            </div>

            <div class="cx-card">
                <h3>👑 VIP Spin</h3>

                <p>
                    Win VIP rewards from 25,000 up to
                    100,000 coins.
                </p>

                ${makeWheel("cx-vip-wheel", VIP_PRIZES)}

                <p>
                    First spin: <strong style="color:${COLORS.gold}">
                    0.25 TON</strong><br>
                    Each repeat: add
                    <strong style="color:${COLORS.gold}">
                    0.05 TON</strong> to the previous price.
                </p>

                <button
                    class="cx-btn"
                    id="cx-vip-spin-button"
                    type="button"
                >
                    VIP SPIN
                </button>

                <div class="cx-vip-note">
                    VIP rewards require verified TON payment
                    on the server. No payment will be requested
                    by this button until verification is ready.
                </div>
            </div>
        </div>
    `;

    document
        .getElementById("cx-back-home")
        .addEventListener("click", goHome);

    document
        .getElementById("cx-spin-button")
        .addEventListener("click", normalSpin);

    document
        .getElementById("cx-vip-spin-button")
        .addEventListener("click", vipSpin);

    syncBalance();
}

/* ---------- SPIN HANDLER ---------- */

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

        wheel.style.transform = "rotate(" + degrees + "deg)";
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
        }, 2850);

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
                "VIP Spin is not activated yet. TON payment verification must be added to the server first.",
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
        }, 2900);
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

window.gamePage = render;
window.renderGame = render;