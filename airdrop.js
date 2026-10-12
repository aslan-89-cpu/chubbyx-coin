
/* =========================================
   CHUBBYX — AIRDROP.JS
   FULL AIRDROP PAGE
========================================= */

(function () {
    "use strict";

    const COINS_KEY = "chubby_coins";
    const CLAIMED_KEY = "chubbyx_airdrop_claimed";

    const TASKS = [
        {
            id: "telegram",
            title: "Join Telegram",
            description: "Join the official ChubbyX Telegram channel.",
            reward: 5000,
            url: "https://t.me/CHANGE_CHANNEL",
            button: "Join"
        },
        {
            id: "follow_x",
            title: "Follow ChubbyX on X",
            description: "Follow the official ChubbyX account.",
            reward: 5000,
            url: "https://x.com/CHANGE_USERNAME",
            button: "Follow"
        },
        {
            id: "invite",
            title: "Invite Friends",
            description: "Invite your friends to ChubbyX.",
            reward: 10000,
            url: "",
            button: "Invite"
        },
        {
            id: "wallet",
            title: "Connect TON Wallet",
            description: "Open the ChubbyX wallet page.",
            reward: 5000,
            url: "",
            button: "Wallet"
        }
    ];

    function getCoins() {
        return Number(localStorage.getItem(COINS_KEY) || 0);
    }

    function getClaimed() {
        try {
            const value = JSON.parse(
                localStorage.getItem(CLAIMED_KEY) || "[]"
            );

            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function saveClaimed(list) {
        localStorage.setItem(
            CLAIMED_KEY,
            JSON.stringify(list)
        );
    }

    function updateCoins(amount) {
        const total = getCoins() + amount;

        localStorage.setItem(COINS_KEY, String(total));

        const score = document.getElementById("main-score");

        if (score) {
            score.textContent = total.toLocaleString();
        }

        return total;
    }

    function openTask(task) {
        if (task.id === "invite") {
            if (typeof window.switchPage === "function") {
                window.switchPage("invites");
            } else {
                alert("Invite page is not available.");
            }
            return;
        }

        if (task.id === "wallet") {
            if (typeof window.switchPage === "function") {
                window.switchPage("wallet");
            } else {
                alert("Wallet page is not available.");
            }
            return;
        }

        if (task.url && !task.url.includes("CHANGE_")) {
            window.open(
                task.url,
                "_blank",
                "noopener,noreferrer"
            );
        } else {
            alert("Please add your official social link first.");
        }
    }

    function claimTask(taskId) {
        const task = TASKS.find(item => item.id === taskId);

        if (!task) return;

        const claimed = getClaimed();

        if (claimed.includes(taskId)) {
            alert("You have already claimed this task.");
            return;
        }

        /*
          DEMO CLAIM:
          This does not verify the task with a server.
          Do not use for valuable or transferable rewards.
        */

        if (task.id === "telegram" || task.id === "follow_x") {
            const confirmed = confirm(
                "Have you completed this task?\n\n" +
                "Demo rewards are not verified."
            );

            if (!confirmed) {
                openTask(task);
                return;
            }
        } else {
            openTask(task);
            return;
        }

        claimed.push(taskId);
        saveClaimed(claimed);

        updateCoins(task.reward);

        renderAirdrop();

        alert(
            "Demo reward added: " +
            task.reward.toLocaleString() +
            " ChubbyX coins!"
        );
    }

    function renderAirdrop() {
        const page = document.getElementById("airdrop-page");

        if (!page) {
            console.warn(
                "ChubbyX Airdrop: #airdrop-page was not found."
            );
            return;
        }

        const claimed = getClaimed();

        page.innerHTML = `
            <div class="cx-airdrop">

                <div class="cx-airdrop-header">
                    <div class="cx-airdrop-icon">🪂</div>
                    <h2>ChubbyX Airdrop</h2>
                    <p>Complete tasks and earn ChubbyX coins!</p>
                </div>

                <div class="cx-airdrop-balance">
                    <span>Your Coin Balance</span>
                    <strong id="cx-airdrop-coins">
                        ${getCoins().toLocaleString()} CX
                    </strong>
                </div>

                <div class="cx-airdrop-section-title">
                    Available Tasks
                </div>

                <div class="cx-airdrop-tasks">
                    ${TASKS.map(task => {
                        const done = claimed.includes(task.id);

                        return `
                            <div class="cx-airdrop-task">
                                <div class="cx-airdrop-task-icon">
                                    ${
                                        task.id === "telegram" ? "✈️" :
                                        task.id === "follow_x" ? "𝕏" :
                                        task.id === "invite" ? "👥" : "👛"
                                    }
                                </div>

                                <div class="cx-airdrop-task-content">
                                    <h3>${task.title}</h3>
                                    <p>${task.description}</p>
                                    <span class="cx-airdrop-reward">
                                        +${task.reward.toLocaleString()} CX
                                    </span>
                                </div>

                                <button
                                    class="cx-airdrop-task-btn"
                                    data-task="${task.id}"
                                    ${done ? "disabled" : ""}
                                >
                                    ${done ? "Claimed ✓" : task.button}
                                </button>
                            </div>
                        `;
                    }).join("")}
                </div>

                <p class="cx-airdrop-notice">
                    Rewards currently use local demo storage.
                    Task completion is not verified by a server.
                </p>

                <button
                    class="cx-airdrop-back"
                    id="cx-airdrop-back"
                >
                    ← Back to Home
                </button>

            </div>
        `;

        page.querySelectorAll("[data-task]").forEach(button => {
            button.addEventListener("click", function () {
                claimTask(this.dataset.task);
            });
        });

        const backButton = document.getElementById("cx-airdrop-back");

        if (backButton) {
            backButton.addEventListener("click", function () {
                if (typeof window.switchPage === "function") {
                    window.switchPage("home");
                }
            });
        }

        addStyles();
    }

    function addStyles() {
        if (document.getElementById("cx-airdrop-style")) return;

        const style = document.createElement("style");
        style.id = "cx-airdrop-style";

        style.textContent = `
            .cx-airdrop {
                width: 100%;
                box-sizing: border-box;
                padding: 20px 15px 35px;
                color: #fff;
                font-family: inherit;
            }

            .cx-airdrop-header {
                text-align: center;
                margin-bottom: 25px;
            }

            .cx-airdrop-icon {
                font-size: 52px;
                margin: 8px 0 12px;
            }

            .cx-airdrop-header h2 {
                color: #eeb308;
                font-size: 25px;
                font-weight: 900;
                margin: 0 0 10px;
            }

            .cx-airdrop-header p {
                color: #c9c5d6;
                font-size: 13px;
                line-height: 1.6;
            }

            .cx-airdrop-balance {
                padding: 18px;
                border-radius: 15px;
                background: #211b38;
                border: 1px solid #554269;
                text-align: center;
                margin-bottom: 25px;
            }

            .cx-airdrop-balance span {
                display: block;
                color: #c9c5d6;
                font-size: 13px;
                margin-bottom: 8px;
            }

            .cx-airdrop-balance strong {
                color: #eeb308;
                font-size: 25px;
                overflow-wrap: anywhere;
            }

            .cx-airdrop-section-title {
                font-size: 17px;
                font-weight: 800;
                margin-bottom: 14px;
            }

            .cx-airdrop-tasks {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .cx-airdrop-task {
                display: flex;
                align-items: center;
                gap: 10px;
                background: #211b38;
                border: 1px solid #403452;
                border-radius: 14px;
                padding: 13px 10px;
                min-width: 0;
            }

            .cx-airdrop-task-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                width: 38px;
                height: 38px;
                background: #332747;
                border-radius: 11px;
                font-size: 19px;
            }

            .cx-airdrop-task-content {
                flex: 1;
                min-width: 0;
            }

            .cx-airdrop-task-content h3 {
                font-size: 13px;
                margin: 0 0 5px;
                color: #fff;
            }

            .cx-airdrop-task-content p {
                font-size: 11px;
                line-height: 1.45;
                color: #bcb5cd;
                margin: 0 0 7px;
            }

            .cx-airdrop-reward {
                color: #eeb308;
                font-size: 12px;
                font-weight: 800;
            }

            .cx-airdrop-task-btn {
                flex-shrink: 0;
                border: none;
                border-radius: 9px;
                padding: 10px 9px;
                background: #eeb308;
                color: #171126;
                font-size: 11px;
                font-weight: 900;
                cursor: pointer;
            }

            .cx-airdrop-task-btn:disabled {
                background: #484153;
                color: #d0cbd9;
            }

            .cx-airdrop-notice {
                color: #a9a2b9;
                font-size: 11px;
                line-height: 1.6;
                text-align: center;
                margin-top: 20px;
            }

            .cx-airdrop-back {
                display: block;
                width: 100%;
                max-width: 220px;
                margin: 25px auto 0;
                padding: 13px;
                border-radius: 11px;
                border: 1px solid #554269;
                background: #302744;
                color: #fff;
                font-size: 14px;
                font-weight: 800;
                cursor: pointer;
            }
        `;

        document.head.appendChild(style);
    }

    window.renderAirdrop = renderAirdrop;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderAirdrop);
    } else {
        renderAirdrop();
    }
})();
