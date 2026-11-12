/* =========================================
   CHUBBYX — INVITE FRIENDS
   Rewards are given by the server only
========================================= */
(function () {
    "use strict";

    const API = "https://chubbyx-server.aslan89aslan1.workers.dev";
    const BOT_APP_LINK = "https://t.me/ChubbyX_Coin_bot/chubbyx";
    const tg = window.Telegram?.WebApp || null;

    async function apiPost(path) {
        if (!tg || !tg.initData) {
            throw new Error("Please reopen ChubbyX from Telegram.");
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch(API + path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData: tg.initData }),
                signal: controller.signal
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data.ok === false) {
                throw new Error(data.error || "Server request failed.");
            }
            return data;
        } finally {
            clearTimeout(timer);
        }
    }

    function getLink() {
        const id = tg?.initDataUnsafe?.user?.id;
        return id ? BOT_APP_LINK + "?startapp=" + encodeURIComponent(String(id)) : BOT_APP_LINK;
    }

    function render() {
        const page = document.getElementById("invites-page");
        if (!page) return;

        const link = getLink();

        page.innerHTML = `
            <h2 class="page-title">👥 Invite Friends</h2>
            <div class="page-content">
                <div class="cx-card">
                    <h3>Earn coins together</h3>
                    <p>
                        Friends 1–10: <b style="color:#eeb308">2,000</b> coins each<br>
                        Friends 11–20: <b style="color:#eeb308">5,000</b> coins each<br>
                        Your friend also gets <b style="color:#eeb308">2,000</b> coins!<br>
                        <span style="font-size:12px">A friend counts after reaching 500 coins in the app.</span>
                    </p>
                    <button class="cx-btn" id="invite-share" type="button">Invite Friends</button>
                    <button class="cx-btn" id="invite-copy" type="button">Copy Invite Link</button>
                    <div class="cx-message" id="invite-message"></div>
                </div>

                <div class="cx-card">
                    <h3>Your invites</h3>
                    <div id="invite-stats"><p>Loading...</p></div>
                </div>
            </div>`;

        document.getElementById("invite-share").onclick = () => {
            const url = "https://t.me/share/url?url=" + encodeURIComponent(link) +
                "&text=" + encodeURIComponent("Join me on ChubbyX and earn coins! 🪙");

            if (tg?.openTelegramLink) {
                tg.openTelegramLink(url);
            } else {
                window.open(url, "_blank");
            }
        };

        document.getElementById("invite-copy").onclick = async () => {
            const msg = document.getElementById("invite-message");
            try {
                await navigator.clipboard.writeText(link);
                msg.textContent = "Invite link copied!";
            } catch (_) {
                msg.textContent = link;
            }
        };

        loadStats();
    }

    async function loadStats() {
        const box = document.getElementById("invite-stats");
        if (!box) return;

        try {
            const d = await apiPost("/api/invite-stats");

            const next = Number(d.nextReward) > 0
                ? "Next friend: +" + Number(d.nextReward).toLocaleString() + " coins"
                : "You reached the maximum invite rewards. Thank you! 💜";

            box.innerHTML = `
                <div class="cx-number">${Number(d.verified)}</div>
                <p>Friends counted<br>
                Waiting for them to reach ${Number(d.verifyCoins)} coins: <b>${Number(d.pending)}</b><br>
                Coins earned: <b style="color:#eeb308">${Number(d.earned).toLocaleString()}</b><br>
                ${next}</p>`;
        } catch (error) {
            box.textContent = error.message || "Could not load your invites.";
        }
    }

    window.updateInviteUI = render;
    window.renderInvitePage = render;
})();
