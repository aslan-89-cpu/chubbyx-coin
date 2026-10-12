/* =========================================
CHUBBYX — INVITE FRIENDS
Milestone rewards + Telegram sharing
========================================= */

(function () {
“use strict”;

const BOT_USERNAME = "ChubbyX_Coin_bot";
const MINI_APP_NAME = "chubbyx";
const COUNT_KEY = "chubby_invites_count";
const CLAIMED_KEY = "chubby_claimed_milestones";
const COINS_KEY = "chubby_coins";
const NEW_USER_REWARD_KEY = "chubby_new_user_reward";
const MILESTONES = [
    { id: "tier1", min: 1,  max: 5,  reward: 5000,  label: "1–5 Friends" },
    { id: "tier2", min: 6,  max: 15, reward: 10000, label: "6–15 Friends" },
    { id: "tier3", min: 16, max: 25, reward: 20000, label: "16–25 Friends" },
    { id: "tier4", min: 26, max: Infinity, reward: 50000, label: "26+ Friends" }
];
function readNumber(key) {
    return Math.max(0, Number(localStorage.getItem(key)) || 0);
}
function getInvitesCount() {
    return readNumber(COUNT_KEY);
}
function getClaimedMilestones() {
    try {
        const data = JSON.parse(localStorage.getItem(CLAIMED_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}
function getNextReward() {
    const invites = getInvitesCount();
    const claimed = getClaimedMilestones();
    return MILESTONES.find(function (milestone) {
        return invites >= milestone.min &&
               !claimed.includes(milestone.id);
    }) || null;
}
function formatCoins(amount) {
    return Number(amount).toLocaleString("en-US");
}
function updateInviteUI() {
    const countText = document.getElementById("ref-count-text");
    const rewardText = document.getElementById("reward-tier-text");
    const claimBtn = document.getElementById("claim-ref-btn");
    if (!countText || !rewardText || !claimBtn) return;
    const invites = getInvitesCount();
    const nextReward = getNextReward();
    countText.textContent = invites.toLocaleString("en-US");
    if (nextReward) {
        rewardText.textContent =
            formatCoins(nextReward.reward) +
            " Coins — " + nextReward.label;
        claimBtn.disabled = false;
        claimBtn.textContent =
            "Claim " + formatCoins(nextReward.reward) + " Coins";
        claimBtn.style.background = "#eeb308";
        claimBtn.style.color = "#000";
        claimBtn.style.cursor = "pointer";
    } else {
        rewardText.textContent = invites === 0
            ? "Invite your first friend!"
            : "All available milestones claimed ✓";
        claimBtn.disabled = true;
        claimBtn.textContent = "No Reward Available";
        claimBtn.style.background = "#444";
        claimBtn.style.color = "#888";
        claimBtn.style.cursor = "not-allowed";
    }
}
function claimInviteReward() {
    const milestone = getNextReward();
    if (!milestone) {
        updateInviteUI();
        return;
    }
    const claimed = getClaimedMilestones();
    if (claimed.includes(milestone.id)) {
        updateInviteUI();
        return;
    }
    claimed.push(milestone.id);
    localStorage.setItem(CLAIMED_KEY, JSON.stringify(claimed));
    const currentCoins = readNumber(COINS_KEY);
    const newCoins = currentCoins + milestone.reward;
    localStorage.setItem(COINS_KEY, String(newCoins));
    // Update the existing ChubbyX balance display if present.
    if (typeof window.count !== "undefined") {
        window.count = newCoins;
    }
    const mainScore = document.getElementById("main-score");
    if (mainScore) {
        mainScore.textContent = formatCoins(newCoins);
    }
    updateInviteUI();
    alert(
        "🎉 ChubbyX Reward Claimed!\n\n" +
        "+" + formatCoins(milestone.reward) + " Coins\n" +
        "Milestone: " + milestone.label
    );
}
function shareInviteLink() {
    let telegramUserId = "";
    try {
        const tg = window.Telegram && window.Telegram.WebApp;
        const user = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
        if (user && user.id) {
            telegramUserId = String(user.id);
        }
    } catch (error) {
        console.warn("Could not read Telegram user ID.", error);
    }
    if (!telegramUserId) {
        alert(
            "Open ChubbyX inside Telegram to create your personal invite link."
        );
        return;
    }
    const startParam = "ref_" + telegramUserId;
    const inviteUrl =
        "https://t.me/" + BOT_USERNAME + "/" +
        MINI_APP_NAME + "?startapp=" + encodeURIComponent(startParam);
    const message =
        "🚀 Join ChubbyX Hub!\n" +
        "Open the app with my invite link:\n" + inviteUrl;
    const shareUrl =
        "https://t.me/share/url?url=" +
        encodeURIComponent(inviteUrl) +
        "&text=" +
        encodeURIComponent("Join ChubbyX Hub and earn ChubbyX Coins! 🚀");
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else if (navigator.share) {
        navigator.share({
            title: "ChubbyX Hub",
            text: message,
            url: inviteUrl
        }).catch(function () {});
    } else {
        window.prompt("Copy your ChubbyX invite link:", inviteUrl);
    }
}
function renderInvitePage() {
    const page = document.getElementById("invites-page");
    if (!page) return;
    page.innerHTML = `
        <h2 class="page-title">Invite Friends</h2>
        <div class="page-content"
            style="text-align:center;display:flex;flex-direction:column;
            align-items:center;max-height:calc(100vh - 220px);
            overflow-y:auto;padding-bottom:20px;">
            <div style="background:rgba(255,255,255,.05);
                border-radius:16px;padding:18px 12px;width:100%;
                max-width:320px;margin-bottom:18px;">
                <div style="font-size:14px;color:#aaa;margin-bottom:6px;">
                    Total Invited Friends
                </div>
                <div style="font-size:36px;font-weight:bold;color:#eeb308;"
                    id="ref-count-text">0</div>
            </div>
            <div style="background:rgba(255,255,255,.04);
                border-radius:14px;padding:16px;width:100%;
                max-width:320px;text-align:left;margin-bottom:18px;
                font-size:13px;line-height:2;">
                <div style="font-weight:bold;color:#eeb308;
                    margin-bottom:8px;">
                    🎁 Referral Rewards
                </div>
                <div style="display:flex;justify-content:space-between;">
                    <span>1–5 friends</span>
                    <b>5,000</b>
                </div>
                <div style="display:flex;justify-content:space-between;">
                    <span>6–15 friends</span>
                    <b>10,000</b>
                </div>
                <div style="display:flex;justify-content:space-between;">
                    <span>16–25 friends</span>
                    <b>20,000</b>
                </div>
                <div style="display:flex;justify-content:space-between;">
                    <span>26+ friends</span>
                    <b>50,000</b>
                </div>
                <div style="color:#aaa;font-size:11px;margin-top:8px;">
                    Each milestone reward can be claimed once.
                </div>
            </div>
            <div style="color:#aaa;font-size:13px;margin-bottom:14px;">
                Available Reward:
                <div id="reward-tier-text"
                    style="color:#fff;font-weight:bold;margin-top:5px;">
                    No reward available
                </div>
            </div>
            <button id="claim-ref-btn" disabled
                style="background:#444;color:#888;border:none;
                padding:14px 20px;border-radius:12px;font-weight:bold;
                font-size:15px;width:100%;max-width:280px;
                cursor:not-allowed;margin-bottom:12px;">
                Claim Reward
            </button>
            <button id="share-ref-btn"
                style="background:linear-gradient(135deg,#ffe38a,#eeb308);
                color:#211400;border:none;padding:14px 20px;
                border-radius:12px;font-weight:bold;font-size:15px;
                width:100%;max-width:280px;cursor:pointer;">
                🔗 Invite a Friend
            </button>
            <p style="font-size:11px;color:#aaa;line-height:1.6;
                max-width:300px;margin-top:14px;">
                Invite counts must be verified by the ChubbyX server
                before real rewards can be safely issued.
            </p>
            <button id="invite-back-home"
                style="background:rgba(255,255,255,.1);color:white;
                border:1px solid rgba(255,255,255,.2);padding:12px;
                border-radius:12px;width:100%;max-width:240px;
                margin-top:14px;margin-bottom:100px;cursor:pointer;">
                ‹ Back to Home
            </button>
        </div>
    `;
    document.getElementById("claim-ref-btn")
        .addEventListener("click", claimInviteReward);
    document.getElementById("share-ref-btn")
        .addEventListener("click", shareInviteLink);
    document.getElementById("invite-back-home")
        .addEventListener("click", function () {
            if (typeof window.switchPage === "function") {
                window.switchPage("home");
            }
        });
    updateInviteUI();
}
// Keep the existing function names available to the app.
window.updateInviteUI = updateInviteUI;
window.shareInviteLink = shareInviteLink;
window.claimInviteReward = claimInviteReward;
function initInvite() {
    renderInvitePage();
    // Support reopening the page after navigation.
    const originalSwitchPage = window.switchPage;
    if (
        typeof originalSwitchPage === "function" &&
        !originalSwitchPage.__chubbyInviteWrapped
    ) {
        const wrappedSwitchPage = function (pageId, element) {
            const result = originalSwitchPage.apply(this, arguments);
            if (pageId === "invites") {
                renderInvitePage();
            }
            return result;
        };
        wrappedSwitchPage.__chubbyInviteWrapped = true;
        window.switchPage = wrappedSwitchPage;
    }
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInvite);
} else {
    initInvite();
}

})();