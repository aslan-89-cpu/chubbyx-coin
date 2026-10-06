/* =========================================
   CHUBBYX — WALLET.JS
   CLEAN TON CONNECT VERSION
========================================= */

let tonConnectUI = null;
let tonConnectStarting = null;
let walletPageCreated = false;

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
        console.error("CHUBBYX: wallet-page NOT FOUND");
        return;
    }


    /* -----------------------------------------
       CREATE WALLET PAGE ONLY ONCE
    ----------------------------------------- */

    if (!walletPageCreated) {

        page.innerHTML = `
            <div class="cx-wallet">

                <button
                    id="cx-wallet-back"
                    type="button"
                    class="cx-back">
                    ‹
                </button>

                <h2>Wallet</h2>

                <p id="cx-message">
                    Connect your TON wallet
                </p>

                <div class="cx-box">

                    <div
                        id="cx-status"
                        class="cx-status">
                        Not Connected
                    </div>

                    <button
                        id="cx-connect"
                        type="button"
                        class="cx-connect">
                        Connect Wallet
                    </button>

                    <button
                        id="cx-disconnect"
                        type="button"
                        class="cx-disconnect"
                        style="display:none;">
                        Disconnect
                    </button>

                </div>

                <button
                    id="cx-home"
                    type="button"
                    class="cx-home">
                    Back to Home
                </button>

            </div>
        `;


        addWalletStyles();


        /* -----------------------------------------
           BUTTONS
        ----------------------------------------- */

        const backButton =
            document.getElementById("cx-wallet-back");

        const homeButton =
            document.getElementById("cx-home");

        const connectButton =
            document.getElementById("cx-connect");

        const disconnectButton =
            document.getElementById("cx-disconnect");


        /* -----------------------------------------
           BACK
        ----------------------------------------- */

        if (backButton) {

            backButton.addEventListener(
                "click",
                goHome
            );

        }


        /* -----------------------------------------
           HOME
        ----------------------------------------- */

        if (homeButton) {

            homeButton.addEventListener(
                "click",
                goHome
            );

        }


        /* -----------------------------------------
           CONNECT
        ----------------------------------------- */

        if (connectButton) {

            connectButton.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "CHUBBYX: CONNECT CLICK"
                    );


                    try {

                        const ui =
                            await startTonConnect();


                        if (!ui) {

                            console.error(
                                "CHUBBYX: TON CONNECT NOT READY"
                            );

                            return;

                        }


                        console.log(
                            "CHUBBYX: OPENING WALLET MODAL"
                        );


                        await ui.openModal();


                        console.log(
                            "CHUBBYX: WALLET MODAL OPENED"
                        );


                    } catch (error) {

                        console.error(
                            "CHUBBYX: OPEN MODAL ERROR",
                            error
                        );

                    }

                }
            );

        }


        /* -----------------------------------------
           DISCONNECT
        ----------------------------------------- */

        if (disconnectButton) {

            disconnectButton.addEventListener(
                "click",
                disconnectWallet
            );

        }


        walletPageCreated = true;

    }


    /* -----------------------------------------
       START TON CONNECT
    ----------------------------------------- */

    startTonConnect();

}


/* =========================================
   WALLET STYLES
========================================= */

function addWalletStyles() {

    if (
        document.getElementById(
            "cx-wallet-style"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "cx-wallet-style";


    style.textContent = `

        #wallet-page {
            overflow-y: auto;
            overflow-x: hidden;
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch;
        }


        .cx-wallet {
            position: relative;

            width: 100%;
            min-height: 100%;

            padding: 70px 20px 100px;

            text-align: center;

            color: white;
        }


        .cx-wallet h2 {
            margin: 0;

            font-size: 28px;

            color: #eeb308;
        }


        .cx-wallet > p {
            margin-top: 8px;

            color: #aaa;

            font-size: 14px;
        }


        .cx-back {
            position: absolute;

            top: 15px;
            left: 15px;

            width: 45px;
            height: 45px;

            border: none;

            border-radius: 50%;

            background:
                rgba(255,255,255,0.12);

            color: white;

            font-size: 34px;

            display: flex;

            align-items: center;
            justify-content: center;

            z-index: 99999;

            cursor: pointer;

            touch-action: manipulation;

            -webkit-tap-highlight-color:
                transparent;
        }


        .cx-box {
            width: 100%;

            max-width: 400px;

            margin: 35px auto 0;

            padding: 25px 20px;

            border-radius: 20px;

            background:
                rgba(255,255,255,0.07);
        }


        .cx-status {
            color: white;

            font-size: 15px;

            margin-bottom: 20px;
        }


        .cx-connect {
            width: 100%;

            max-width: 320px;

            min-height: 52px;

            padding: 15px 20px;

            border: none;

            border-radius: 14px;

            background: #2196F3;

            color: white;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            touch-action: manipulation;

            -webkit-tap-highlight-color:
                transparent;

            position: relative;

            z-index: 99999;
        }


        .cx-connect:active {
            transform: scale(0.98);
        }


        .cx-disconnect {
            width: 100%;

            max-width: 320px;

            margin-top: 15px;

            padding: 15px;

            border: none;

            border-radius: 14px;

            background: #ff4d4d;

            color: white;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            touch-action: manipulation;

            position: relative;

            z-index: 99999;
        }


        .cx-home {
            position: absolute;

            left: 20px;
            right: 20px;
            bottom: 20px;

            width: calc(100% - 40px);

            padding: 15px;

            border: none;

            border-radius: 15px;

            background:
                rgba(255,255,255,0.12);

            color: white;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            z-index: 99999;

            touch-action: manipulation;
        }

    `;


    document.head.appendChild(style);

}


/* =========================================
   TON CONNECT
========================================= */

async function startTonConnect() {

    /* -----------------------------------------
       ALREADY CREATED
    ----------------------------------------- */

    if (tonConnectUI) {

        updateWalletUI(
            tonConnectUI.wallet
        );

        return tonConnectUI;

    }


    /* -----------------------------------------
       PREVENT DUPLICATE START
    ----------------------------------------- */

    if (tonConnectStarting) {

        return tonConnectStarting;

    }


    tonConnectStarting =
        (async function () {

            try {

                /* ---------------------------------
                   CHECK SDK
                --------------------------------- */

                if (
                    !window.TON_CONNECT_UI ||
                    !window.TON_CONNECT_UI.TonConnectUI
                ) {

                    console.error(
                        "CHUBBYX: TON CONNECT SDK NOT FOUND"
                    );

                    return null;

                }


                /* ---------------------------------
                   CREATE TON CONNECT
                --------------------------------- */

                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL,

                        uiPreferences: {

                            theme: "DARK"

                        }

                    });


                /* ---------------------------------
                   GLOBAL
                --------------------------------- */

                window.tonConnectUI =
                    tonConnectUI;


                /* ---------------------------------
                   TELEGRAM MINI APP
                --------------------------------- */

                tonConnectUI.uiOptions = {

                    twaReturnUrl:
                        TWA_RETURN_URL

                };


                /* ---------------------------------
                   WALLET STATUS
                --------------------------------- */

                tonConnectUI.onStatusChange(
                    function (wallet) {

                        console.log(
                            "CHUBBYX WALLET STATUS:",
                            wallet
                        );

                        updateWalletUI(
                            wallet
                        );

                    }
                );


                /* ---------------------------------
                   RESTORE CONNECTION
                --------------------------------- */

                try {

                    await
                        tonConnectUI.connectionRestored;

                } catch (error) {

                    console.log(
                        "CHUBBYX RESTORE:",
                        error
                    );

                }


                /* ---------------------------------
                   UPDATE UI
                --------------------------------- */

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


                return null;


            } finally {

                tonConnectStarting = null;

            }

        })();


    return tonConnectStarting;

}


/* =========================================
   UPDATE WALLET UI
========================================= */

function updateWalletUI(wallet) {

    const status =
        document.getElementById(
            "cx-status"
        );

    const message =
        document.getElementById(
            "cx-message"
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

        }


        if (disconnect) {

            disconnect.style.display =
                "none";

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


        console.log(
            "CHUBBYX: WALLET DISCONNECTED"
        );


    } catch (error) {

        console.error(
            "CHUBBYX DISCONNECT ERROR:",
            error
        );

    }

}


/* =========================================
   GO HOME
========================================= */

function goHome(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();

    }


    console.log(
        "CHUBBYX: GO HOME"
    );


    /* -----------------------------------------
       CLOSE TON CONNECT MODAL
    ----------------------------------------- */

    try {

        if (
            tonConnectUI &&
            typeof tonConnectUI.closeModal ===
                "function"
        ) {

            tonConnectUI.closeModal();

        }

    } catch (error) {

        console.log(
            "CHUBBYX CLOSE MODAL:",
            error
        );

    }


    /* -----------------------------------------
       RETURN TO HOME
    ----------------------------------------- */

    if (
        typeof window.switchPage ===
            "function"
    ) {

        window.switchPage(
            "home"
        );

    }

}


/* =========================================
   GLOBAL
========================================= */

window.walletPage =
    walletPage;

window.startTonConnect =
    startTonConnect;

window.disconnectWallet =
    disconnectWallet;

window.goHome =
    goHome;


console.log(
    "CHUBBYX: WALLET.JS LOADED"
);