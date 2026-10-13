/* =========================================
   CHUBBYX — TASKS
   ALL TASKS SHOW "Coming Soon"
   COIN REWARDS DISABLED
   NO index.html CHANGES REQUIRED
========================================= */
(function () {
    const tasksPage = document.getElementById("tasks-page");
    if (!tasksPage) return;
    const TASKS = [
        {
            id: "tg",
            icon: "✈️",
            title: "Join Telegram Channel",
            description: "Join the official ChubbyX channel.",
            button: "Join"
        },
        {
            id: "group",
            icon: "👥",
            title: "Join Telegram Group",
            description: "Join the ChubbyX community group.",
            button: "Join"
        },
        {
            id: "x_follow",
            icon: "𝕏",
            title: "Follow X Account",
            description: "Follow the official ChubbyX account.",
            button: "Follow"
        },
        {
            id: "x_like",
            icon: "❤️",
            title: "Like X Post",
            description: "Open the official post on X.",
            button: "Open"
        }
    ];
    function renderTasks() {
        tasksPage.innerHTML = `
            <style>
                .cx-tasks {
                    width: 100%;
                    max-width: 520px;
                    margin: 0 auto;
                    padding-bottom: 24px;
                }
                .cx-tasks-heading {
                    color: #eeb308;
                    font-size: 27px;
                    font-weight: 800;
                    text-align: center;
                    margin: 8px 0;
                }
                .cx-tasks-subtitle {
                    color: #aaa;
                    font-size: 13px;
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 22px;
                }
                .cx-tasks-section {
                    color: #eeb308;
                    font-size: 16px;
                    font-weight: 800;
                    margin: 22px 0 12px;
                }
                .cx-task-item {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 14px;
                    margin-bottom: 12px;
                    border-radius: 15px;
                    background: rgba(255,255,255,.055);
                    border: 1px solid rgba(255,255,255,.09);
                }
                .cx-task-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    width: 43px;
                    height: 43px;
                    border-radius: 12px;
                    background: rgba(238,179,8,.12);
                    font-size: 21px;
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
                    border: 0;
                    border-radius: 10px;
                    padding: 10px 13px;
                    background: #eeb308;
                    color: #130f26;
                    font-weight: 800;
                    font-size: 12px;
                    flex-shrink: 0;
                    cursor: pointer;
                    min-width: 94px;
                    white-space: nowrap;
                }
                .cx-task-button:active {
                    transform: scale(.96);
                }
                .cx-task-locked {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 14px;
                    background: rgba(238,179,8,.07);
                    border: 1px solid rgba(238,179,8,.2);
                    text-align: center;
                    color: #ccc;
                    font-size: 12px;
                    line-height: 1.7;
                }
                .cx-task-locked strong {
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
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                }
            </style>
            <div class="cx-tasks">
                <h2 class="cx-tasks-heading">CHUBBYX TASKS</h2>
                <p class="cx-tasks-subtitle">
                    Complete social tasks and join our community.
                </p>
                <div class="cx-tasks-section">✈️ Telegram Tasks</div>
                ${TASKS
                    .filter(t => t.id === "tg" || t.id === "group")
                    .map(t => `
                        <div class="cx-task-item">
                            <div class="cx-task-icon">${t.icon}</div>
                            <div class="cx-task-info">
                                <div class="cx-task-title">${t.title}</div>
                                <div class="cx-task-description">
                                    ${t.description}
                                </div>
                            </div>
                            <button
                                class="cx-task-button"
                                type="button"
                                data-task-id="${t.id}">
                                ${t.button}
                            </button>
                        </div>
                    `).join("")}
                <div class="cx-tasks-section">𝕏 X Tasks</div>
                ${TASKS
                    .filter(t => t.id === "x_follow" || t.id === "x_like")
                    .map(t => `
                        <div class="cx-task-item">
                            <div class="cx-task-icon">${t.icon}</div>
                            <div class="cx-task-info">
                                <div class="cx-task-title">${t.title}</div>
                                <div class="cx-task-description">
                                    ${t.description}
                                </div>
                            </div>
                            <button
                                class="cx-task-button"
                                type="button"
                                data-task-id="${t.id}">
                                ${t.button}
                            </button>
                        </div>
                    `).join("")}
                <div class="cx-task-locked">
                    🔒 <strong>Coin Rewards Not Active Yet</strong><br>
                    Tasks are available to view, but no coins are awarded.
                    Verification and rewards will be added later.
                </div>
                <button
                    class="cx-task-back"
                    id="cx-task-back"
                    type="button">
                    ‹ Back to Home
                </button>
            </div>
        `;
        // Every task button changes to "Coming Soon".
        tasksPage.querySelectorAll("[data-task-id]").forEach(button => {
            button.addEventListener("click", function () {
                button.textContent = "Coming Soon";
                button.disabled = true;
                button.style.background = "#2b2639";
                button.style.color = "#eeb308";
                button.style.cursor = "default";
                button.style.opacity = "1";
            });
        });
        // Return to the Home page.
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