/* =========================================
   CHUBBYX GAMES
   Daily Spin + VIP Spin (unchanged logic)
   + Quiz, Memory Match, Daily Streak
   Glass style design
   Preserves existing coin balance
========================================= */

(function () {
    "use strict";

    const API = "https://chubbyx-server.aslan89aslan1.workers.dev";
    const tg = window.Telegram?.WebApp || null;

    const NORMAL_PRIZES = [0, 5000, 0, 10000, 5000, 15000];
    const VIP_PRIZES = [25000, 50000, 25000, 75000, 50000, 100000];

    // Free games are for fun for now. Coins must be given by the
    // server only, so rewards stay OFF until the server supports it.
    const GAME_REWARDS_ACTIVE = true;

    const COLORS = {
        lightPurple: "#E2D3FF",
        white: "#FFFFFF",
        muted: "#D3C8EE",
        red: "#FF8F9E",
        green: "#7BF0B5",
        gold: "#FFD76A"
    };

    function maybeAd(placement) {
        try {
            if (typeof window.cxAd === "function") window.cxAd(placement);
        } catch (_) {}
    }

    async function claimReward(game, score, elId) {
        const el = document.getElementById(elId);
        if (!el) return;
        el.textContent = "Claiming reward...";
        el.style.color = COLORS.lightPurple;
        try {
            const data = await apiPost("/api/game-reward", { game, score });
            if (Number.isSafeInteger(Number(data.coins))) setBalance(Number(data.coins));
            el.textContent = Number(data.reward) > 0
                ? "+" + Number(data.reward).toLocaleString() + " coins! 🎉"
                : "No coins this time. Try again!";
            el.style.color = COLORS.green;
        } catch (error) {
            el.textContent = error.message || "Could not claim reward.";
            el.style.color = error.status === 409 ? COLORS.muted : COLORS.red;
        }
    }

    let spinning = false;
    let renderVersion = 0;
    let spinTimeout = null;
    let requestController = null;

    /* ---------- balance + server ---------- */

    function setBalance(value) {
        const coins = Number(value);
        if (!Number.isSafeInteger(coins) || coins < 0) return;

        // Only save a valid balance returned by the server.
        localStorage.setItem("chubby_coins", String(coins));

        const score = document.getElementById("main-score");
        if (score) score.textContent = coins.toLocaleString();

        const balance = document.getElementById("cx-balance");
        if (balance) {
            balance.textContent =
                "Your balance: " + coins.toLocaleString() + " coins";
        }
    }

    async function apiPost(endpoint, extra = {}) {
        if (!tg || !tg.initData) {
            throw new Error("Please reopen ChubbyX from Telegram.");
        }

        const controller = new AbortController();
        requestController = controller;

        const timer = setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch(API + endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    initData: tg.initData,
                    ...extra
                }),
                signal: controller.signal
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
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error(
                    "Server took too long to respond. Please try again."
                );
            }
            throw error;
        } finally {
            clearTimeout(timer);
            if (requestController === controller) {
                requestController = null;
            }
        }
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
            if (Number.isSafeInteger(Number(data.coins)) && Number(data.coins) >= 0) {
                setBalance(Number(data.coins));
                showMessage("Your balance: " + Number(data.coins).toLocaleString() + " coins");
            }
        } catch (error) {
            console.error("ChubbyX balance sync failed:", error);
            showMessage(error.message, true);
        }
    }

    /* ---------- wheel markup ---------- */

    function makeWheel(id, prizes) {
        return `
            <div class="cx-wheel-wrap">
                <div class="cx-pointer"></div>
                <div id="${id}" class="cx-wheel">
                    ${prizes.map((prize, i) => {
                        const angle = i * 60;
                        return `<div class="cx-wheel-label"
                          style="transform:rotate(${angle}deg) translateY(-72px) rotate(-${angle}deg)">
                          ${prize.toLocaleString()}
                        </div>`;
                    }).join("")}
                    <div class="cx-wheel-center">CHUBBYX</div>
                </div>
            </div>`;
    }

    /* ---------- styles (glass look) ---------- */

    function addStyles() {
        if (document.getElementById("cx-games-theme")) return;

        const style = document.createElement("style");
        style.id = "cx-games-theme";
        style.textContent = `
            #games-page {
                overflow-y:auto; overflow-x:hidden; color:${COLORS.white};
                padding:28px 14px 40px; scrollbar-width:none;
                background:
                    radial-gradient(circle at 15% 8%, rgba(168,85,247,.45), transparent 42%),
                    radial-gradient(circle at 90% 30%, rgba(236,72,153,.32), transparent 45%),
                    radial-gradient(circle at 20% 78%, rgba(56,189,248,.28), transparent 45%),
                    #130f26 !important;
            }
            #games-page::-webkit-scrollbar { display:none; }
            #games-page .page-title {
                color:#fff!important; text-align:center; font-size:28px; font-weight:900;
                margin:12px 0 20px; text-shadow:0 0 18px rgba(196,140,255,.8);
            }
            #games-page .page-content { width:100%; max-width:480px; margin:auto; }

            #games-page .cx-card {
                position:relative; width:100%; box-sizing:border-box; padding:22px 16px;
                margin-bottom:20px; border-radius:26px; text-align:center;
                background:linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.05));
                -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px);
                border:1px solid rgba(255,255,255,.28);
                box-shadow:0 10px 34px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.35);
            }
            #games-page .cx-card::before {
                content:""; position:absolute; inset:0; border-radius:26px; pointer-events:none;
                background:linear-gradient(160deg, rgba(255,255,255,.16), transparent 38%);
            }
            #games-page .cx-card h3 {
                font-size:24px; font-weight:900; margin:2px 0 10px; color:#fff;
            }
            #games-page .cx-card p { color:${COLORS.muted}; font-size:14px; line-height:1.7; }

            #games-page .cx-wheel-wrap { position:relative; width:250px; height:250px; margin:24px auto; }
            #games-page .cx-wheel {
                position:relative; width:230px; height:230px; margin:10px auto;
                box-sizing:border-box; overflow:hidden; border-radius:50%;
                border:5px solid rgba(255,255,255,.75);
                background:conic-gradient(from -30deg,
                    #a855f7 0 60deg, #3b1d6e 60deg 120deg,
                    #ec4899 120deg 180deg, #4c1d95 180deg 240deg,
                    #38bdf8 240deg 300deg, #2e1065 300deg);
                box-shadow:0 0 30px rgba(192,132,252,.75), inset 0 0 22px rgba(0,0,0,.45);
                transition:transform 3s cubic-bezier(.12,.72,.12,1); transform:rotate(0deg);
            }
            #games-page .cx-wheel-label {
                position:absolute; top:50%; left:50%; width:92px; margin-left:-46px; margin-top:-10px;
                text-align:center; white-space:nowrap; font-size:12px; font-weight:1000;
                color:#fff; text-shadow:0 2px 4px #000; pointer-events:none;
            }
            #games-page .cx-wheel-center {
                position:absolute; z-index:4; left:50%; top:50%; transform:translate(-50%,-50%);
                display:flex; align-items:center; justify-content:center; width:72px; height:72px;
                border-radius:50%; border:3px solid rgba(255,255,255,.85);
                background:linear-gradient(145deg,#7c3aed,#1e0b45);
                color:#fff; font-size:10px; font-weight:1000; box-shadow:0 0 14px rgba(167,139,250,.8);
            }
            #games-page .cx-pointer {
                position:absolute; z-index:6; top:-1px; left:50%; transform:translateX(-50%);
                width:0; height:0; border-left:15px solid transparent; border-right:15px solid transparent;
                border-top:28px solid ${COLORS.gold}; filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));
            }

            #games-page .cx-btn, #games-page #cx-back-home {
                display:block; width:100%; box-sizing:border-box; min-height:50px; padding:13px;
                margin:14px 0 0; border:1px solid rgba(255,255,255,.35); border-radius:16px;
                background:linear-gradient(110deg,#c084fc,#7c3aed 55%,#ec4899);
                color:#fff; font-size:16px; font-weight:900; cursor:pointer;
                box-shadow:0 6px 20px rgba(168,85,247,.45), inset 0 1px 0 rgba(255,255,255,.4);
                transition:transform .1s ease;
            }
            #games-page .cx-btn:active, #games-page #cx-back-home:active { transform:scale(.97); }
            #games-page #cx-vip-spin-button {
                background:linear-gradient(110deg,#fff1b8,#ffc93c 55%,#ff9f1c);
                color:#3a2200; box-shadow:0 6px 22px rgba(255,201,60,.5), inset 0 1px 0 rgba(255,255,255,.6);
            }
            #games-page #cx-back-home {
                margin:0 0 18px; min-height:44px; font-size:15px;
                background:linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.06));
                -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); box-shadow:none;
            }
            #games-page .cx-btn:disabled { opacity:.55; }
            #games-page .cx-btn.cx-ghost {
                background:linear-gradient(145deg, rgba(255,255,255,.2), rgba(255,255,255,.07));
                box-shadow:none;
            }
            #games-page .cx-message { min-height:24px; margin-top:12px; font-size:14px; line-height:1.6; }
            #games-page .cx-vip-note, #games-page .cx-reward-note {
                margin-top:14px; padding:12px; border:1px solid rgba(255,255,255,.22);
                border-radius:14px; background:rgba(255,255,255,.07);
                color:${COLORS.muted}; font-size:12px; line-height:1.7;
            }

            /* quiz */
            #games-page .cx-q { font-size:17px; font-weight:800; margin:10px 0 14px; color:#fff; line-height:1.5; }
            #games-page .cx-opt {
                display:block; width:100%; margin:8px 0; padding:13px; box-sizing:border-box;
                border-radius:14px; border:1px solid rgba(255,255,255,.3);
                background:linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.06));
                color:#fff; font-size:15px; font-weight:700; cursor:pointer;
            }
            #games-page .cx-opt.ok { background:rgba(60,220,140,.35); border-color:${COLORS.green}; }
            #games-page .cx-opt.bad { background:rgba(255,90,110,.35); border-color:${COLORS.red}; }
            #games-page .cx-progress { color:${COLORS.muted}; font-size:13px; }
            #games-page .cx-big { font-size:34px; font-weight:900; color:${COLORS.gold}; margin:10px 0; }

            /* memory */
            #games-page .cx-mem-grid {
                display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:14px 0 6px;
            }
            #games-page .cx-mem-card {
                aspect-ratio:1; border-radius:14px; font-size:30px; cursor:pointer;
                border:1px solid rgba(255,255,255,.3); color:#fff;
                background:linear-gradient(145deg, rgba(255,255,255,.22), rgba(255,255,255,.06));
                display:flex; align-items:center; justify-content:center;
            }
            #games-page .cx-mem-card.open { background:linear-gradient(145deg,#a855f7,#7c3aed); }
            #games-page .cx-mem-card.done { background:rgba(60,220,140,.35); border-color:${COLORS.green}; }

            /* streak */
            #games-page .cx-days { display:flex; justify-content:space-between; gap:5px; margin:16px 0 4px; }
            #games-page .cx-day {
                flex:1; padding:9px 0; border-radius:12px; font-size:12px; font-weight:800;
                border:1px solid rgba(255,255,255,.25); background:rgba(255,255,255,.07); color:${COLORS.muted};
            }
            #games-page .cx-day.on {
                background:linear-gradient(145deg,#ffd76a,#ff9f1c); color:#3a2200; border-color:#ffe39a;
            }
        `;
        document.head.appendChild(style);
    }

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

    function shuffle(list) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function rewardNote() {
        return GAME_REWARDS_ACTIVE
            ? ""
            : `<div class="cx-reward-note">🔒 Coin rewards for this game are not active yet. Play for fun!</div>`;
    }

    /* ---------- QUIZ ---------- */

    const QUIZ = [
        { q: "What does TON stand for?",
          a: "The Open Network",
          o: ["Top Online Node", "Token Open Network", "Trade On Network"] },
        { q: "What must you NEVER share with anyone?",
          a: "Your seed phrase",
          o: ["Your wallet address", "Your username", "Your coin balance"] },
        { q: "Which of these is a TON wallet?",
          a: "Tonkeeper",
          o: ["Gmail", "Chrome", "Spotify"] },
        { q: "What is a blockchain?",
          a: "A shared digital record of transactions",
          o: ["A type of phone", "A game console", "A social media app"] },
        { q: "Someone says they are 'support' and asks for your seed phrase. What is it?",
          a: "A scam",
          o: ["Normal support", "A required step", "A safe request"] }
    ];

    function initQuiz() {
        const box = document.getElementById("cx-quiz-box");
        if (!box) return;

        let step = 0;
        let score = 0;
        let order = shuffle(QUIZ);

        function showQuestion() {
            const item = order[step];
            const options = shuffle([item.a, ...item.o]);

            box.innerHTML = `
                <div class="cx-progress">Question ${step + 1} / ${order.length}</div>
                <div class="cx-q">${item.q}</div>
                ${options.map((text, i) =>
                    `<button class="cx-opt" type="button" data-i="${i}">${text}</button>`
                ).join("")}`;

            box.querySelectorAll(".cx-opt").forEach((btn) => {
                btn.addEventListener("click", () => {
                    const correct = btn.textContent === item.a;
                    box.querySelectorAll(".cx-opt").forEach((b) => {
                        b.disabled = true;
                        if (b.textContent === item.a) b.classList.add("ok");
                    });
                    if (!correct) btn.classList.add("bad");
                    if (correct) score++;

                    setTimeout(() => {
                        step++;
                        if (step < order.length) showQuestion();
                        else showResult();
                    }, 900);
                });
            });
        }

        function showResult() {
            box.innerHTML = `
                <div class="cx-big">${score} / ${order.length}</div>
                <p>${score === order.length ? "Perfect! You are a crypto pro 🏆"
                    : score >= 3 ? "Great job! 🎉" : "Good try! Play again 💪"}</p>
                <div class="cx-message" id="cx-quiz-reward"></div>
                <button class="cx-btn" id="cx-quiz-again" type="button">Play Again</button>`;
            claimReward("quiz", score, "cx-quiz-reward");
            maybeAd("quiz_end");
            document.getElementById("cx-quiz-again").addEventListener("click", () => {
                step = 0;
                score = 0;
                order = shuffle(QUIZ);
                showQuestion();
            });
        }

        box.innerHTML = `<button class="cx-btn" id="cx-quiz-start" type="button">START QUIZ</button>`;
        document.getElementById("cx-quiz-start").addEventListener("click", showQuestion);
    }

    /* ---------- MEMORY MATCH ---------- */

    const MEM_ICONS = ["🐻", "🪙", "🚀", "💎", "⭐", "🎁"];

    function initMemory() {
        const box = document.getElementById("cx-memory-box");
        if (!box) return;

        function start() {
            const cards = shuffle([...MEM_ICONS, ...MEM_ICONS]);
            let first = null;
            let lock = false;
            let moves = 0;
            let matched = 0;

            box.innerHTML = `
                <div class="cx-progress" id="cx-mem-moves">Moves: 0</div>
                <div class="cx-mem-grid">
                    ${cards.map((icon, i) =>
                        `<button class="cx-mem-card" type="button" data-i="${i}">?</button>`
                    ).join("")}
                </div>`;

            const buttons = box.querySelectorAll(".cx-mem-card");
            const movesEl = document.getElementById("cx-mem-moves");

            buttons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    const i = Number(btn.dataset.i);
                    if (lock || btn.classList.contains("open") || btn.classList.contains("done")) return;

                    btn.textContent = cards[i];
                    btn.classList.add("open");

                    if (first === null) {
                        first = i;
                        return;
                    }

                    moves++;
                    movesEl.textContent = "Moves: " + moves;

                    const a = first;
                    first = null;

                    if (cards[a] === cards[i]) {
                        buttons[a].classList.remove("open");
                        buttons[a].classList.add("done");
                        btn.classList.remove("open");
                        btn.classList.add("done");
                        matched++;

                        if (matched === MEM_ICONS.length) {
                            setTimeout(() => {
                                box.innerHTML = `
                                    <div class="cx-big">🎉 ${moves} moves</div>
                                    <p>You matched all the cards!</p>
                                    <div class="cx-message" id="cx-mem-reward"></div>
                                    <button class="cx-btn" id="cx-mem-again" type="button">Play Again</button>`;
                                document.getElementById("cx-mem-again").addEventListener("click", start);
                                claimReward("memory", moves, "cx-mem-reward");
                                maybeAd("memory_end");
                            }, 500);
                        }
                    } else {
                        lock = true;
                        setTimeout(() => {
                            buttons[a].classList.remove("open");
                            buttons[a].textContent = "?";
                            btn.classList.remove("open");
                            btn.textContent = "?";
                            lock = false;
                        }, 700);
                    }
                });
            });
        }

        box.innerHTML = `<button class="cx-btn" id="cx-mem-start" type="button">START GAME</button>`;
        document.getElementById("cx-mem-start").addEventListener("click", start);
    }

    /* ---------- DAILY STREAK (server-side) ---------- */

    function initStreak() {
        const box = document.getElementById("cx-streak-box");
        if (!box) return;

        function draw(data, message, isError) {
            const count = Number(data.count) || 0;
            const done = !!data.claimedToday;
            const filled = count > 0 ? ((count - 1) % 7) + 1 : 0;
            const next = Number(data.nextReward) || 0;

            box.innerHTML = `
                <div class="cx-big">🔥 ${count} day${count === 1 ? "" : "s"}</div>
                <div class="cx-days">
                    ${[1, 2, 3, 4, 5, 6, 7].map((d) =>
                        `<div class="cx-day ${d <= filled ? "on" : ""}">${d}</div>`
                    ).join("")}
                </div>
                <button class="cx-btn" id="cx-streak-btn" type="button" ${done ? "disabled" : ""}>
                    ${done ? "CHECKED IN TODAY ✅" : "CHECK IN (+" + next.toLocaleString() + ")"}
                </button>
                <div class="cx-message" id="cx-streak-msg"></div>`;

            const msg = document.getElementById("cx-streak-msg");
            if (msg && message) {
                msg.textContent = message;
                msg.style.color = isError ? COLORS.red : COLORS.green;
            }

            const btn = document.getElementById("cx-streak-btn");
            if (btn && !done) {
                btn.addEventListener("click", async () => {
                    btn.disabled = true;
                    try {
                        const res = await apiPost("/api/streak", {});
                        if (Number.isSafeInteger(Number(res.coins))) setBalance(Number(res.coins));
                        draw(res, "+" + Number(res.reward).toLocaleString() +
                            " coins! Come back tomorrow 🔥", false);
                        maybeAd("streak");
                    } catch (error) {
                        if (error.status === 409) {
                            load();
                        } else {
                            btn.disabled = false;
                            draw(data, error.message, true);
                        }
                    }
                });
            }
        }

        async function load() {
            box.innerHTML = '<p>Loading...</p>';
            try {
                const data = await apiPost("/api/streak", { action: "status" });
                draw(data, "", false);
            } catch (error) {
                box.innerHTML = "";
                const p = document.createElement("div");
                p.className = "cx-message";
                p.style.color = COLORS.red;
                p.textContent = error.message || "Could not load streak.";
                box.appendChild(p);
            }
        }

        load();
    }

    /* ---------- page ---------- */

    function render() {
        const page = document.getElementById("games-page");
        if (!page) return;

        renderVersion++;
        if (spinTimeout) clearTimeout(spinTimeout);
        if (requestController) requestController.abort();

        spinning = false;
        addStyles();

        const saved = localStorage.getItem("chubby_coins");
        const parsed = saved === null ? NaN : Number(saved);
        const initialBalance = Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;

        page.innerHTML = `
            <h2 class="page-title">🎮 ChubbyX Games</h2>
            <div class="page-content">
                <button id="cx-back-home" type="button">← Back to Home</button>

                <div class="cx-card">
                    <h3>🎰 Daily Spin</h3>
                    <p>Spin once per day for a chance to win up to 15,000 coins.</p>
                    ${makeWheel("cx-spin-wheel", NORMAL_PRIZES)}
                    <button class="cx-btn" id="cx-spin-button" type="button">SPIN NOW</button>
                    <div class="cx-message" id="cx-game-message" aria-live="polite">
                        ${initialBalance === null ? "Loading your server balance..." :
                          "Your balance: " + initialBalance.toLocaleString() + " coins"}
                    </div>
                </div>

                <div class="cx-card">
                    <h3>🧠 Crypto Quiz</h3>
                    <p>Answer 5 quick questions about crypto and staying safe. Earn coins once per day!</p>
                    <div id="cx-quiz-box"></div>
                </div>

                <div class="cx-card">
                    <h3>🃏 Memory Match</h3>
                    <p>Flip the cards and find all the matching pairs. Earn coins once per day!</p>
                    <div id="cx-memory-box"></div>
                </div>

                <div class="cx-card">
                    <h3>📅 Daily Streak</h3>
                    <p>Come back every day to build your streak.</p>
                    <div id="cx-streak-box"></div>
                </div>

                <div class="cx-card">
                    <h3>📺 Support ChubbyX</h3>
                    <p>Watch a short ad to support the project. Thank you! 💜</p>
                    <button class="cx-btn" id="cx-watch-ad" type="button">WATCH AD</button>
                    <div class="cx-message" id="cx-ad-message"></div>
                </div>

                <div class="cx-card">
                    <h3>👑 VIP Spin</h3>
                    <p>VIP rewards range from 25,000 up to 100,000 coins.</p>
                    ${makeWheel("cx-vip-wheel", VIP_PRIZES)}
                    <p>First spin: <strong style="color:${COLORS.gold}">0.25 TON</strong><br>
                    Each repeat adds <strong style="color:${COLORS.gold}">0.05 TON</strong>.</p>
                    <button class="cx-btn" id="cx-vip-spin-button" type="button">VIP SPIN</button>
                    <div class="cx-vip-note">
                        VIP rewards are only added after server-side TON payment verification.
                    </div>
                </div>
            </div>`;

        document.getElementById("cx-back-home").addEventListener("click", goHome);
        document.getElementById("cx-spin-button").addEventListener("click", normalSpin);
        document.getElementById("cx-vip-spin-button").addEventListener("click", vipSpin);

        document.getElementById("cx-watch-ad").addEventListener("click", async () => {
            const msg = document.getElementById("cx-ad-message");
            const btn = document.getElementById("cx-watch-ad");
            btn.disabled = true;
            msg.textContent = "Loading ad...";
            let ok = false;
            try {
                ok = typeof window.cxRewardedAd === "function"
                    ? await window.cxRewardedAd()
                    : false;
            } catch (_) {}
            msg.textContent = ok
                ? "Thank you for supporting ChubbyX! 💜"
                : "No ad available right now. Please try again later.";
            btn.disabled = false;
        });

        initQuiz();
        initMemory();
        initStreak();
        syncBalance();
    }

    /* ---------- spins (logic unchanged) ---------- */

    async function runSpin(endpoint, buttonId, wheelId, prizes, isVip) {
        if (spinning) return;

        const button = document.getElementById(buttonId);
        const wheel = document.getElementById(wheelId);
        if (!button || !wheel) return;

        spinning = true;
        button.disabled = true;
        button.textContent = "CHECKING...";
        showMessage(isVip ? "Checking VIP payment verification..." : "Checking your daily spin...");

        try {
            const data = await apiPost(endpoint);
            const reward = Number(data.reward);
            const coins = Number(data.coins);

            if (!Number.isSafeInteger(reward) || !prizes.includes(reward) ||
                !Number.isSafeInteger(coins) || coins < 0) {
                throw new Error("The server returned an invalid spin result.");
            }

            setBalance(coins);

            const indexes = [];
            prizes.forEach((value, index) => {
                if (value === reward) indexes.push(index);
            });
            const index = indexes[Math.floor(Math.random() * indexes.length)];
            const finalDegrees = (360 * 5) + (360 - index * 60);

            wheel.style.transform = "rotate(" + finalDegrees + "deg)";
            button.textContent = "SPINNING...";

            spinTimeout = window.setTimeout(() => {
                showMessage((isVip ? "VIP Spin: You won " : "You won ") +
                    reward.toLocaleString() + " coins!");
                spinning = false;
                maybeAd(isVip ? "vip_spin_end" : "spin_end");
                const current = document.getElementById(buttonId);
                if (current) {
                    current.disabled = false;
                    current.textContent = isVip ? "VIP SPIN" : "SPIN NOW";
                }
            }, 3050);
        } catch (error) {
            console.error("ChubbyX spin failed:", error);

            if (error.data && Number.isSafeInteger(Number(error.data.coins)) &&
                Number(error.data.coins) >= 0) {
                setBalance(Number(error.data.coins));
            }

            if (error.status === 409 && !isVip) {
                showMessage("You have already spun today. Try again tomorrow.", true);
            } else if (isVip && (error.status === 501 || error.status === 404)) {
                showMessage("VIP Spin is not activated on the server yet. Payment verification is required.", true);
            } else {
                showMessage(error.message || "Spin failed. Please try again.", true);
            }

            spinning = false;
            button.disabled = false;
            button.textContent = isVip ? "VIP SPIN" : "SPIN NOW";
        }
    }

    function normalSpin() {
        return runSpin("/api/normal-spin", "cx-spin-button", "cx-spin-wheel", NORMAL_PRIZES, false);
    }

    function vipSpin() {
        return runSpin("/api/vip-spin", "cx-vip-spin-button", "cx-vip-wheel", VIP_PRIZES, true);
    }

    window.gamePage = render;
    window.renderGame = render;
})();
