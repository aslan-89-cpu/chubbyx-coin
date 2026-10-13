/* =========================================
   CHUBBYX — AIRDROP.JS
   COMING SOON + BACK BUTTON
========================================= */
(function () {
    "use strict";
    function openAirdropPage() {
        const page = document.getElementById("airdrop-page");
        if (!page) {
            console.error("ChubbyX: airdrop-page not found");
            return;
        }
        // Hide other main pages
        document.querySelectorAll(
            "#home-layout, #tasks-page, #invites-page, #games-page, #wallet-page, #menu-page"
        ).forEach(function (el) {
            el.style.display = "none";
        });
        // Show Airdrop page
        page.style.display = "block";
        // Build Airdrop UI
        page.innerHTML = `
            <div style="
                min-height: 80vh;
                padding: 24px 18px;
                box-sizing: border-box;
                background: #130f26;
                color: white;
                text-align: center;
                font-family: Arial, sans-serif;
            ">
                <button id="chubbyx-airdrop-back" style="
                    display: block;
                    padding: 11px 20px;
                    margin-bottom: 55px;
                    background: #eeb308;
                    color: #130f26;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                ">⬅ BACK</button>
                <div style="
                    font-size: 64px;
                    margin-bottom: 18px;
                ">🪂</div>
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
            </div>
        `;
        // Back to Home
        document.getElementById(
            "chubbyx-airdrop-back"
        ).addEventListener("click", function () {
            page.style.display = "none";
            const home = document.getElementById("home-layout");
            if (home) {
                home.style.display = "";
            }
            // Restore home navigation if available
            if (typeof showPage === "function") {
                try {
                    showPage("home");
                } catch (e) {
                    console.log("Home restored");
                }
            }
        });
    }
    // Available for your existing navigation
    window.openAirdropPage = openAirdropPage;
})();