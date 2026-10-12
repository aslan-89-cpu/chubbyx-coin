
/* =========================================
   CHUBBYX — TASKS.JS
   Telegram + X Tasks
   COIN REWARDS DISABLED
========================================= */

(function () {
    "use strict";

    const tasksPage = document.getElementById("tasks-page");

    if (!tasksPage) {
        console.error("ChubbyX: tasks-page not found.");
        return;
    }

    const TASKS = [
        {
            id: "telegram",
            section: "telegram",
            icon: "✈️",
            title: "Join Telegram Channel",
            description: "Join the official ChubbyX channel.",
            button: "Join Channel",
            url: "https://t.me/chubbyx_coin"
        },
        {
            id: "x_follow",
            section: "x",
            icon: "𝕏",
            title: "Follow ChubbyX on X",
            description: "Follow our official X account.",
            button: "Follow",
            url: "https://x.com/chubbyx_coin"
        }
    ];

    function openTask(task) {
        if (!task || !task.url) return;

        const opened = window.open(
            task.url,
            "_blank"
        );

        // Fallback for browsers that block new windows.
        if (!opened) {
            window.location.href = task.url;
        }
    }

    function renderTasks() {
        tasksPage.innerHTML = `
            <style>
                .cx-task-wrap {
                    width: 100%;
                    max-width: 520px;
                    margin: 0 auto;
                    padding-bottom: 25px;
                }

                .cx-task-heading {
                    color: #eeb308;
                    font-size: 27px;
                    font-weight: 800;
                    text-align: center;
                    margin: 5px 0 8px;
                }

                .cx-task-subtitle {
                    color: #aaa;
                    font-size: 13px;
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 24px;
                }

                .cx-task-section {
                    color: #eeb308;
                    font-size: 16px;
                    font-weight: 800;
                    margin: 22px 0 12px;
                }

                .cx-task-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px;
                    margin-bottom: 12px;
                    border-radius: 15px;
                    background: rgba(255,255,255,.055);
                    border: 1px solid rgba(255,255,255,.09);
                }

                .cx-task-icon {
                    width: 44px;
                    height: 44px;
                    min-width: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    background: rgba(238,179,8,.12);
                    font-size: 22px;
                }

                .cx-task-info {
                    flex: 1;
                    min-width: 0;
                }

                .cx-task-title {
                    color: #fff;
                    font-size: 13px;
                    font-weight: 750;
                    margin-bottom: 5px;
                }

                .cx-task-description {
                    color: #aaa;
                    font-size: 11px;
                    line-height: 1.5;
                }

                .cx-task-button {
                    flex-shrink: 0;
                    border: none;
                    border-radius: 10px;
                    padding: 10px 12px;
                    background: #eeb308;
                    color: #130f26;
                    font-size: 12px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .cx-task-button:active {
                    transform: scale(.96);
                }

                .cx-task-notice {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 14px;
                    background: rgba(238,179,8,.07);
                    border: 1px solid rgba(238,179,8,.2);
                    color: #ccc;
                    font-size: 12px;
                    line-height: 1.7;
                    text-align: center;
                }

                .cx-task-notice strong {
                    color: #eeb308;
                }

                .cx-task-back {
                    display: block;
                    width: 100%;
                    max-width: 240px;
                    margin: 24px auto 100px;
                    padding: 12px;
                    border: 1px solid rgba(255,255,255,.15);
                    border-radius: 12px;
                    background: rgba(255,255,255,.08);
                    color: white;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                }
            </style>

            <div class="cx-task-wrap">

                <h2 class="cx-task-heading">
                    CHUBBYX TASKS
                </h2>

                <p class="cx-task-subtitle">
                    Join our community and follow ChubbyX.
                </p>

                <div class="cx-task-section">
                    ✈️ Telegram Tasks
                </div>

                ${TASKS.filter(t => t.section === "telegram").map(t => `
                    <div class="cx-task-card">
                        <div class="cx-task-icon">${t.icon}</div>

                        <div class="cx-task-info">
                            <div class="cx-task-title">${t.title}</div>
                            <div class="cx-task-description">${t.description}</div>
                        </div>

                        <button class="cx-task-button"
                            data-task="${t.id}">
                            ${t.button}
                        </button>
                    </div>
                `).join("")}

                <div class="cx-task-section">
                    𝕏 X Tasks
                </div>

                ${TASKS.filter(t => t.section === "x").map(t => `
                    <div class="cx-task-card">
                        <div class="cx-task-icon">${t.icon}</div>

                        <div class="cx-task-info">
                            <div class="cx-task-title">${t.title}</div>
                            <div class="cx-task-description">${t.description}</div>
                        </div>

                        <button class="cx-task-button"
                            data-task="${t.id}">
                            ${t.button}
                        </button>
                    </div>
                `).join("")}

                <div class="cx-task-notice">
                    🔒 <strong>Rewards are coming soon!</strong><br>
                    Tasks are available, but no coins are awarded yet.
                    Verification and rewards will be enabled later.
                </div>

                <button class="cx-task-back" id="cx-task-back">
                    ‹ Back to Home
                </button>

            </div>
        `;

        tasksPage.querySelectorAll("[data-task]").forEach(button => {
            button.addEventListener("click", function () {
                const task = TASKS.find(
                    item => item.id === button.dataset.task
                );

                openTask(task);
            });
        });

        const backButton = document.getElementById("cx-task-back");

        if (backButton) {
            backButton.addEventListener("click", function () {
                if (typeof window.switchPage === "function") {
                    window.switchPage("home");
                }
            });
        }
    }

    renderTasks();
})();
