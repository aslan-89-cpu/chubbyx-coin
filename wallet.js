/* =========================================
   CHUBBYX — WALLET.JS
   CLEAN TON CONNECT VERSION
========================================= */

let tonConnectUI = null;
let tonConnectReady = false;
let tonConnectStarting = null;
let walletOpening = false;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

const TWA_RETURN_URL =
    "https://t.me/ChubbyX_Coin_bot/chubbyx";


/* =========================================
   WALLET PAGE
========================================= */

function walletPage() {

    const page = document.getElementById("wallet-page");

    if (!page) {
        console.error("CHUBBYX: wallet-page not found");
        return;
    }

    page.innerHTML = `
        <div class="cx-wallet-inner">

            <button
                id="cx-wallet-back"
                type="button"
                class="cx-wallet-back"
            >‹</button>

            <div class="cx-wallet-title">
                <h2>Wallet</h2>
                <p id="cx-wallet-message">
                    Connect your TON wallet
                </p>
            </div>

            <div class="cx-wallet-box">

                <div
                    id="cx-wallet-status"
                    class="cx-wallet-status"
                >
                    Not Connected
                </div>

                <button
                    id="cx-connect"
                    type="button"
                    class="cx-wallet-button"
                >
                    Connect Wallet
                </button>

                <button
                    id="cx-disconnect"
                    type="button"
                    class="cx-wallet-button cx-disconnect"
                    style="display:none;"
                >
                    Disconnect
                </button>

            </div>

            <button
                id="cx-home"
                type="button"
                class="cx-home-button"
            >
                Back to Home
            </button>

        </div>
    `;

    addWalletStyles();

    document.getElementById("cx-connect").onclick =
        openWallet;

    document.getElementById("cx-disconnect").onclick =
        disconnectWallet;

    document.getElementById("cx-wallet-back").onclick =
        goHome;

    document.getElementById("cx-home").onclick =
        goHome;

    updateWalletUI(
        tonConnectUI
            ? tonConnectUI.wallet
            : null
    );

    startTonConnect();
}


/* =========================================
   STYLES
========================================= */

function addWalletStyles() {

    if (
        document.getElementById("cx-wallet-style")
    ) {
        return;
    }

    const style = document.createElement("style");

    style.id = "cx-wallet-style";

    style.textContent = `

        #wallet-page {
            overflow-y: auto;
            overflow-x: hidden;
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch;
        }

        .cx-wallet-inner {
            position: relative;
            width: 100%;
            min-height: 100%;
            padding: 70px 20px 100px;
            text-align: center;
            color: white;
        }

        .cx-wallet-back {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 45px;
            height: 45px;
            border: 0;
            border-radius: 50%;
            background: rgba(255,255,255,.12);
            color: white;
            font-size: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            cursor: pointer;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        .cx-wallet-title {
            text-align: center;
            margin-top: 10px;
        }

        .cx-wallet-title h2 {
            margin: 0;
            font-size: 28px;
            color: #eeb308;
        }

        .cx-wallet-title p {
            margin-top: 8px;
            color: #aaa;
            font-size: 14px;
        }

        .cx-wallet-box {
            width: 100%;
            max-width: 400px;
            margin: 35px auto 0;
            padding: 25px 20px;
            border-radius: 20px;
            background: rgba(255,255,255,.07);
        }

        .cx-wallet-status {
            margin-bottom: 20px;
            color: white;
            font-size: 15px;
            word-break: break-word;
        }

        .cx-wallet-button {
            width: 100%;
            max-width: 320px;
            padding: 15px;
            border: 0;
            border-radius: 14px;
            background: white;
            color: #111;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        .cx-disconnect {
            background: #ff4d4d;
            color: white;
        }

        .cx-home-button {
            position: absolute;
            left: 20px;
            right: 20px;
            bottom: 20px;
            width: calc(100% - 40px);
            padding: 15px;
            border: 0;
            border-radius: 15px;
            background: rgba(255,255,255,.12);
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10;
            touch-action: manipulation;
        }

    `;

    document.head.appendChild(style);
}


/* =========================================
   WAIT FOR SDK
========================================= */

function waitForTonConnectSDK() {

    return new Promise((resolve) => {

        if (
            window.TON_CONNECT_UI &&
            window.TON_CONNECT_UI.TonConnectUI
        ) {
            resolve(true);
            return;
        }

        let tries = 0;

        const timer = setInterval(() => {

            tries++;

            if (
                window.TON_CONNECT_UI &&
                window.TON_CONNECT_UI.TonConnectUI
            ) {

                clearInterval(timer);
                resolve(true);
                return;
            }

            if (tries >= 100) {

                clearInterval(timer);

                console.error(
                    "CHUBBYX: TON Connect SDK unavailable"
                );

                resolve(false);
            }

        }, 100);
    });
}


/* =========================================
   START TON CONNECT
========================================= */

async function startTonConnect() {

    if (
        tonConnectUI &&
        tonConnectReady
    ) {
        return tonConnectUI;
    }

    if (tonConnectStarting) {
        return tonConnectStarting;
    }

    tonConnectStarting = (async () => {

        try {

            const ready =
                await waitForTonConnectSDK();

            if (!ready) {
                return null;
            }

            tonConnectUI =
                new window.TON_CONNECT_UI.TonConnectUI({
                    manifestUrl: MANIFEST_URL
                });

            window.tonConnectUI =
                tonConnectUI;

            /*
             * IMPORTANT:
             * uiOptions is assigned as a whole object.
             */

            tonConnectUI.uiOptions = {
                twaReturnUrl: TWA_RETURN_URL
            };

            tonConnectUI.onStatusChange(
                function(wallet) {

                    console.log(
                        "CHUBBYX wallet:",
                        wallet
                    );

                    updateWalletUI(wallet);
                }
            );

            try {
                await tonConnectUI.connectionRestored;
            } catch (e) {
                console.log(
                    "CHUBBYX restore:",
                    e
                );
            }

            tonConnectReady = true;

            updateWalletUI(
                tonConnectUI.wallet
            );

            console.log(
                "CHUBBYX: TON CONNECT READY"
            );

            return tonConnectUI;

        } catch (error) {

            console.error(
                "CHUBBYX TON CONNECT ERROR:",
                error
            );

            tonConnectUI = null;
            window.tonConnectUI = null;
            tonConnectReady = false;

            updateWalletUI(null);

            return null;

        } finally {

            tonConnectStarting = null;

        }

    })();

    return tonConnectStarting;
}


/* =========================================
   CONNECT BUTTON
========================================= */

async function openWallet(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (walletOpening) {
        return;
    }

    walletOpening = true;

    const button =
        document.getElementById("cx-connect");

    if (button) {
        button.disabled = true;
        button.textContent = "Opening...";
    }

    try {

        console.log(
            "CHUBBYX: CONNECT CLICK"
        );

        const ui =
            await startTonConnect();

        if (!ui) {

            console.error(
                "CHUBBYX: TON Connect unavailable"
            );

            return;
        }

        if (ui.wallet) {

            updateWalletUI(
                ui.wallet
            );

            return;
        }

        /*
         * THIS IS THE ONLY ACTION
         * USED TO OPEN THE TON WALLET PICKER.
         */

        await ui.openModal();

    } catch (error) {

        console.error(
            "CHUBBYX OPEN ERROR:",
            error
        );

    } finally {

        walletOpening = false;

        const btn =
            document.getElementById("cx-connect");

        if (btn) {
            btn.disabled = false;

            if (
                !tonConnectUI ||
                !tonConnectUI.wallet
            ) {
                btn.textContent =
                    "Connect Wallet";
            }
        }
    }
}


/* =========================================
   DISCONNECT
========================================= */

async function disconnectWallet(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    try {

        if (!tonConnectUI) {
            return;
        }

        await tonConnectUI.disconnect();

        updateWalletUI(null);

    } catch (error) {

        console.error(
            "CHUBBYX DISCONNECT ERROR:",
            error
        );
    }
}


/* =========================================
   UPDATE UI
========================================= */

function updateWalletUI(wallet) {

    const status =
        document.getElementById(
            "cx-wallet-status"
        );

    const message =
        document.getElementById(
            "cx-wallet-message"
        );

    const connect =
        document.getElementById(
            "cx-connect"
        );

    const disconnect =
        document.getElementById(
            "cx-disconnect"
        );

    if (!status) {
        return;
    }

    if (wallet) {

        status.textContent =
            "Wallet Connected";

        if (message) {
            message.textContent =
                "TON wallet connected";
        }

        if (connect) {
            connect.style.display =
                "none";
        }

        if (disconnect) {
            disconnect.style.display =
                "block";
        }

    } else {

        status.textContent =
            "Not Connected";

        if (message) {
            message.textContent =
                "Connect your TON wallet";
        }

        if (connect) {
            connect.style.display =
                "block";

            connect.disabled = false;
            connect.textContent =
                "Connect Wallet";
        }

        if (disconnect) {
            disconnect.style.display =
                "none";
        }
    }
}


/* =========================================
   BACK TO HOME
========================================= */

async function goHome(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    console.log(
        "CHUBBYX: BACK TO HOME"
    );

    walletOpening = false;

    /*
     * Close TON modal first.
     */

    try {

        if (
            tonConnectUI &&
            typeof tonConnectUI.closeModal ===
                "function"
        ) {

            await tonConnectUI.closeModal();

        }

    } catch (e) {

        console.log(
            "CHUBBYX close modal:",
            e
        );

    }

    /*
     * Then use the main app navigation.
     */

    if (
        typeof window.switchPage ===
            "function"
    ) {

        window.switchPage(
            "home"
        );

        return;
    }

    /*
     * Fallback.
     */

    const wallet =
        document.getElementById(
            "wallet-page"
        );

    const home =
        document.getElementById(
            "home-layout"
        );

    if (wallet) {
        wallet.classList.remove("active");
    }

    if (home) {
        home.style.display = "flex";
    }
}


/* =========================================
   GLOBAL
========================================= */

window.walletPage =
    walletPage;

window.openWallet =
    openWallet;

window.disconnectWallet =
    disconnectWallet;

window.goHome =
    goHome;

window.startTonConnect =
    startTonConnect;

console.log(
    "CHUBBYX: wallet.js loaded"
);