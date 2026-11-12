/* =========================================
   CHUBBYX — TASKS
   Rewards are given by the server only
========================================= */
(function () {
    "use strict";

    const API = "https://chubbyx-server.aslan89aslan1.workers.dev";
    const tg = window.Telegram?.WebApp || null;

    // ---- Fill in your links. Empty link = "Coming Soon" ----
    const LINKS = {
        tg_channel: "https://t.me/chubbyx_coin",
        tg_group: "",   // example: "https://t.me/your_group_username"
        x_follow: "",   // example: "https://x.com/your_account"
        x_like: ""      // example: "https://x.com/your_account/status/123456789"
    };

    const TASK_LIST = [
        { section: "✈️ Telegram Tasks" },
        { id: "tg_channel", icon: "✈️", title: "Join Telegram Channel",
          desc: "Join the official ChubbyX channel.", kind: "telegram", openText: "Join" },
        { id: "tg_group", icon: "👥", title: "Join Telegram Group",
          desc: "Join the ChubbyX community group.", kind: "telegram", openText: "Join" },
        { section: "𝕏 X Tasks" },
        { id: "x_follow", icon: "𝕏", title: "Follow X Account",
          desc: "Follow the official ChubbyX account.", kind: "link", openText: "Follow" },
        { id: "x_like", icon: "❤️", title: "Like X Post",
          desc: "Open the official post on X and like it.", kind: "link", openText: "Open" }
    ];

    let state = {};       // server info per task
    let step = {};        // local step per task: "opened" | "ready"
    let messages = {};
    let timers = {};

    async function apiPost(path, extra) {
        if (!tg || !tg.initData) {
            throw new Error("Please reopen ChubbyX from Telegram.");
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch(API + path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData: tg.initData, ...(extra || {}) }),
                signal: controller.signal
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data.ok === false) {
                const error = new Error(data.error || "Server request failed.");
                error.status = response.status;
                throw error;
            }
            return data;
        } finally {
            clearTimeout(timer);
        }
    }

    function updateBalance(coins) {
        const n = Number(coins);
        if (!Number.isSafeInteger(n) || n < 0) return;
        try { localStorage.setItem("chubby_coins", String(n)); } catch (_) {}
        const score = document.getElementById("main-score");
        if (score) score.textContent = n.toLocaleString();
    }

    function openLink(url) {
        if (!url) return;
        if (/^https:\/\/t\.me\//i.test(url) && tg?.openTelegramLink) {
            tg.openTelegramLink(url);
        } else if (tg?.openLink) {
            tg.openLink(url);
        } else {
            window.open(url, "_blank");
        }
    }

    function esc(text) {
        const div = document.createElement("div");
        div.textContent = String(text);
        return div.innerHTML;
    }

    function buttonFor(task) {
        const info = state[task.id] || {};
        const hasLink = !!LINKS[task.id];

        if (info.claimed) return { html: "✅ Done", disabled: true, cls: "done" };
        if (!hasLink || info.available === false) return { html: "Coming Soon", disabled: true, cls: "soon" };

        const current = step[task.id];
        if (task.kind === "telegram") {
            return current === "opened"
                ? { html: "Verify", disabled: false, cls: "" }
                : { html: task.openText, disabled: false, cls: "" };
        }

        if (current === "waiting") return { html: "Wait...", disabled: true, cls: "wait" };
        if (current === "ready") return { html: "Claim", disabled: false, cls: "" };
        return { html: task.openText, disabled: false, cls: "" };
    }

    function render() {
        const page = document.getElementById("tasks-page");
        if (!page) return;

        const cards = TASK_LIST.map((task) => {
            if (task.section) {
                return `<h3 class="cxt-section">${esc(task.section)}</h3>`;
            }

            const btn = buttonFor(task);
            const reward = Number((state[task.id] || {}).reward || 0);
            const message = messages[task.id] || "";

            return `
                <div class="cxt-card">
                    <div class="cxt-row">
                        <div class="cxt-icon">${esc(task.icon)}</div>
                        <div class="cxt-text">
                            <div class="cxt-title">${esc(task.title)}</div>
                            <div class="cxt-desc">${esc(task.desc)}</div>
                            ${reward ? `<div class="cxt-reward">+${reward.toLocaleString()} coins</div>` : ""}
                        </div>
                        <button class="cxt-btn ${btn.cls}" data-task="${task.id}" type="button"
                            ${btn.disabled ? "disabled" : ""}>${btn.html}</button>
                    </div>
                    ${message ? `<div class="cxt-msg" id="cxt-msg-${task.id}">${esc(message)}</div>` : ""}
                </div>`;
        }).join("");

        page.innerHTML = `
            <style>
                #tasks-page{overflow-y:auto}
                .cxt-wrap{width:100%;max-width:480px;margin:0 auto;padding-bottom:30px}
                .cxt-head{text-align:center;color:#eeb308;font-size:28px;font-weight:900;margin:10px 0 6px}
                .cxt-sub{text-align:center;color:#c9c5d6;font-size:14px;margin-bottom:18px}
                .cxt-section{color:#eeb308;font-size:19px;margin:20px 0 10px}
                .cxt-card{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:14px;margin-bottom:12px}
                .cxt-row{display:flex;align-items:center;gap:12px}
                .cxt-icon{width:48px;height:48px;min-width:48px;border-radius:14px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:24px}
                .cxt-text{flex:1;min-width:0}
                .cxt-title{font-weight:800;font-size:16px;color:#fff}
                .cxt-desc{font-size:13px;color:#c9c5d6;margin-top:3px}
                .cxt-reward{font-size:13px;color:#eeb308;font-weight:800;margin-top:4px}
                .cxt-btn{border:0;border-radius:12px;padding:11px 16px;font-weight:900;font-size:14px;background:#eeb308;color:#130f26;cursor:pointer;white-space:nowrap}
                .cxt-btn:disabled{cursor:default}
                .cxt-btn.soon,.cxt-btn.wait{background:rgba(255,255,255,.1);color:#eeb308}
                .cxt-btn.done{background:rgba(80,220,140,.25);color:#7bf0b5}
                .cxt-msg{font-size:12px;color:#c9c5d6;margin-top:10px;overflow-wrap:anywhere}
                .cxt-back{display:block;width:100%;margin-top:18px;padding:13px;border-radius:18px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-weight:800;font-size:15px;cursor:pointer}
            </style>
            <div class="cxt-wrap">
                <div class="cxt-head">CHUBBYX TASKS</div>
                <div class="cxt-sub">Complete tasks and earn coins. Each task pays once.</div>
                ${cards}
                <button class="cxt-back" id="cxt-back" type="button">‹ Back to Home</button>
            </div>`;

        page.querySelectorAll(".cxt-btn[data-task]").forEach((btn) => {
            btn.addEventListener("click", () => handle(btn.dataset.task));
        });

        const back = document.getElementById("cxt-back");
        if (back) {
            back.addEventListener("click", () => {
                if (typeof window.switchPage === "function") window.switchPage("home");
            });
        }
    }

    function setMessage(id, text) {
        messages[id] = text;
        render();
    }

    async function handle(id) {
        const task = TASK_LIST.find((t) => t.id === id);
        if (!task) return;

        try {
            if (task.kind === "telegram") {
                if (step[id] !== "opened") {
                    openLink(LINKS[id]);
                    step[id] = "opened";
                    setMessage(id, "Join, then come back and tap Verify.");
                    return;
                }
                await claim(id);
                return;
            }

            // link task (X)
            if (step[id] === "ready") {
                await claim(id);
                return;
            }

            const started = await apiPost("/api/task-start", { task: id });
            openLink(LINKS[id]);
            startCountdown(id, Number(started.wait) || 15);
        } catch (error) {
            messages[id] = error.message || "Something went wrong.";
            render();
        }
    }

    function startCountdown(id, seconds) {
        step[id] = "waiting";
        let left = seconds;
        clearInterval(timers[id]);
        messages[id] = "Do the task, then claim in " + left + "s.";
        render();

        timers[id] = setInterval(() => {
            left--;
            if (left <= 0) {
                clearInterval(timers[id]);
                step[id] = "ready";
                messages[id] = "Done? Tap Claim.";
            } else {
                messages[id] = "Do the task, then claim in " + left + "s.";
            }
            render();
        }, 1000);
    }

    async function claim(id) {
        messages[id] = "Checking...";
        render();

        try {
            const data = await apiPost("/api/task-claim", { task: id });
            updateBalance(data.coins);
            state[id] = { ...(state[id] || {}), claimed: true };
            messages[id] = "+" + Number(data.reward).toLocaleString() + " coins! 🎉";
        } catch (error) {
            if (error.status === 409) {
                state[id] = { ...(state[id] || {}), claimed: true };
                messages[id] = "";
            } else {
                messages[id] = error.message || "Could not verify.";
            }
        }
        render();
    }

    async function loadTasks() {
        render();
        try {
            const data = await apiPost("/api/tasks-status");
            state = data.tasks || {};
        } catch (error) {
            console.error("ChubbyX tasks load failed:", error);
        }
        render();
    }

    window.renderTasks = loadTasks;
    window.tasksPage = loadTasks;
})();
