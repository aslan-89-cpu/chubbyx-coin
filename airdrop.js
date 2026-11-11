/* =========================================
   CHUBBYX — AIRDROP.JS
   COMING SOON + BACK BUTTON (fixed)
========================================= */
(function () {
    "use strict";

    function renderAirdrop() {
        const page = document.getElementById("airdrop-page");
        if (!page) {
            console.error("ChubbyX: airdrop-page not found");
            return;
        }

        // index.html's switchPage() already shows this page,
        // so we only need to fill it with content.
        page.innerHTML = `
            <div style="
                width: 100%;
                padding: 24px 0;
                box-sizing: border-box;
                color: white;
                text-align: center;
            ">
                <div style="font-size: 64px; margin-bottom: 18px;">🪂</div>

                <h1 style="
                    color: #eeb308;
                    font-size: 30px;
                    margin: 0 0 18px;
                    font-weight: 900;
                ">CHUBBYX AIRDROP</h1>

                <div style="
                    display: inline-block;
                    padding: 13px 24px;
                    border: 2px solid #eeb308;
                    border-radius: 14px;
                    color: #eeb308;
                    font-size: 21px;
                    font-weight: 900;
                    letter-spacing: 2px;
                    margin-bottom: 22px;
                ">COMING SOON</div>

                <p style="
                    color: #d4cfe5;
                    font-size: 15px;
                    line-height: 1.8;
                    max-width: 320px;
                    margin: 0 auto;
                ">
                    The ChubbyX Airdrop is coming soon!
                    Stay tuned for future announcements.
                </p>

                <div style="
                    margin-top: 35px;
                    color: #eeb308;
                    font-size: 14px;
                    font-weight: bold;
                ">🐻 CHUBBYX COIN</div>

                <button id="chubbyx-airdrop-back" type="button" style="
                    margin-top: 40px;
                    padding: 12px 28px;
                    background: #eeb308;
                    color: #130f26;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                ">⬅ BACK</button>
            </div>
        `;

        document
            .getElementById("chubbyx-airdrop-back")
            .addEventListener("click", function () {
                if (typeof window.switchPage === "function") {
                    window.switchPage("home");
                }
            });
    }

    // index.html looks for window.renderAirdrop
    window.renderAirdrop = renderAirdrop;
    // Kept for backward compatibility
    window.openAirdropPage = renderAirdrop;
})();
