/* =========================================
   CHUBBYX — WALLET.JS
   TON CONNECT FIXED
========================================= */

let tonConnectUI = null;
let tonConnectStarting = null;

let walletPageCreated = false;
let walletOpening = false;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

const TWA_RETURN_URL =
    "https://t.me/ChubbyX_Coin_bot/chubbyx";


/* =========================================
   WALLET PAGE
========================================= */

function walletPage() {

    const page =
        document.getElementById("wallet-page");

    if (!page) {
        console.error(
            "CHUBBYX: wallet-page NOT FOUND"
        );
        return;
    }


    /* =====================================
       CREATE WALLET PAGE ONCE
    ===================================== */

    if (!walletPageCreated) {

        page.innerHTML = `
            <div class="cx-wallet">

                <button
                    id="cx-wallet-back"
                    type="button"
                    class="cx-back"
                >
                    ‹
                </button>

                <h2>Wallet</h2>

                <p id="cx-message">
                    Connect your TON wallet
                </p>

                <div class="cx-box">

                    <div
                        id="cx-status"
                        class="cx-status"
                    >
                        Not Connected
                    </div>

                    <!-- TON CONNECT ROOT -->
                    <div
                        id="cx-ton-root"
                        class="cx-ton-root"
                    ></div>

                    <button
                        id="cx-disconnect"
                        type="button"
                        class="cx-disconnect"
                        style="display:none;"
                    >
                        Disconnect
                    </button>

                </div>

                <button
                    id="cx-home"
                    type="button"
                    class="cx-home"
                >
                    Back to Home
                </button>

            </div>
        `;


        addWalletStyles();


        /* =================================
           BACK BUTTON
        ================================= */

        const backButton =
            document.getElementById(
                "cx-wallet-back"
            );

        if (backButton) {

            backButton.onclick =
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "CHUBBYX: BACK"
                    );

                    goHome();
                };
        }


        /* =================================
           HOME BUTTON
        ================================= */

        const homeButton =
            document.getElementById(
                "cx-home"
            );

        if (homeButton) {

            homeButton.onclick =
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    goHome();
                };
        }


        /* =================================
           DISCONNECT
        ================================= */

        const disconnectButton =
            document.getElementById(
                "cx-disconnect"
            );

        if (disconnectButton) {

            disconnectButton.onclick =
                disconnectWallet;
        }


        walletPageCreated = true;
    }


    /* =====================================
       START TON CONNECT
    ===================================== */

    startTonConnect();
}


/* =========================================
   STYLES
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

        /* ================================
           WALLET PAGE
        ================================= */

        #wallet-page {

            overflow: hidden !important;

            overflow-x: hidden !important;

            overflow-y: hidden !important;

            touch-action: none !important;

            position: relative !important;

            width: 100% !important;

            height: 100% !important;
        }


        .cx-wallet {

            position: relative;

            width: 100%;

            height: 100%;

            min-height: 100%;

            box-sizing: border-box;

            padding:
                70px 20px 110px;

            text-align: center;

            color: white;

            overflow: hidden;

            touch-action: none;
        }


        /* ================================
           TITLE
        ================================= */

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


        /* ================================
           BACK
        ================================= */

        .cx-back {

            position: absolute;

            top: 15px;

            left: 15px;

            width: 45px;

            height: 45px;

            padding: 0;

            border: none;

            border-radius: 50%;

            background:
                rgba(255,255,255,0.12);

            color: white;

            font-size: 34px;

            line-height: 45px;

            display: flex;

            align-items: center;

            justify-content: center;

            z-index: 999999;

            cursor: pointer;

            pointer-events: auto;

            touch-action: manipulation;

            -webkit-tap-highlight-color:
                transparent;
        }


        /* ================================
           BOX
        ================================= */

        .cx-box {

            width: 100%;

            max-width: 400px;

            margin:
                35px auto 0;

            padding:
                25px 20px;

            box-sizing: border-box;

            border-radius: 20px;

            background:
                rgba(255,255,255,0.07);
        }


        /* ================================
           STATUS
        ================================= */

        .cx-status {

            color: white;

            font-size: 15px;

            margin-bottom: 20px;
        }


        /* ================================
           TON ROOT
        ================================= */

        .cx-ton-root {

            width: 100%;

            min-height: 52px;

            display: flex;

            align-items: center;

            justify-content: center;

            position: relative;

            z-index: 999999;
        }


        /* TON CONNECT GENERATED BUTTON */

        .cx-ton-root button {

            min-height: 52px !important;

            min-width: 220px !important;

            border-radius: 14px !important;

            cursor: pointer !important;

            pointer-events: auto !important;
        }


        /* ================================
           DISCONNECT
        ================================= */

        .cx-disconnect {

            width: 100%;

            max-width: 320px;

            margin:
                15px auto 0;

            padding: 15px;

            border: none;

            border-radius: 14px;

            background: #ff4d4d;

            color: white;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            position: relative;

            z-index: 999999;

            touch-action: manipulation;
        }


        /* ================================
           HOME
        ================================= */

        .cx-home {

            position: absolute;

            left: 20px;

            right: 20px;

            bottom: 20px;

            width:
                calc(100% - 40px);

            padding: 15px;

            border: none;

            border-radius: 15px;

            background:
                rgba(255,255,255,0.12);

            color: white;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            z-index: 999999;

            pointer-events: auto;

            touch-action: manipulation;

            -webkit-tap-highlight-color:
                transparent;
        }


        /* ================================
           ERROR
        ================================= */

        .cx-error {

            margin-top: 15px;

            padding: 10px;

            border-radius: 10px;

            background:
                rgba(255,0,0,0.12);

            color: #ff5555;

            font-size: 12px;

            word-break: break-word;
        }

    `;


    document.head.appendChild(style);
}


/* =========================================
   TON CONNECT
========================================= */

async function startTonConnect() {

    /* ALREADY READY */

    if (tonConnectUI) {

        updateWalletUI(
            tonConnectUI.wallet
        );

        return tonConnectUI;
    }


    /* ALREADY STARTING */

    if (tonConnectStarting) {

        return tonConnectStarting;
    }


    tonConnectStarting =
        (async function() {

            try {

                console.log(
                    "CHUBBYX: TON CONNECT START"
                );


                /* =========================
                   CHECK SDK
                ========================= */

                if (
                    !window.TON_CONNECT_UI ||
                    !window.TON_CONNECT_UI.TonConnectUI
                ) {

                    throw new Error(
                        "TON Connect SDK not loaded"
                    );
                }


                /* =========================
                   ROOT
                ========================= */

                const root =
                    document.getElementById(
                        "cx-ton-root"
                    );

                if (!root) {

                    throw new Error(
                        "TON Connect root not found"
                    );
                }


                /*
                 * Clear root first
                 */

                root.innerHTML = "";


                /* =========================
                   CREATE TON CONNECT
                ========================= */

                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL,

                        buttonRootId:
                            "cx-ton-root"

                    });


                window.tonConnectUI =
                    tonConnectUI;


                /* =========================
                   UI OPTIONS
                ========================= */

                tonConnectUI.uiOptions = {

                    actionsConfiguration: {

                        twaReturnUrl:
                            TWA_RETURN_URL
                    },

                    uiPreferences: {

                        theme: "DARK"
                    }
                };


                /* =========================
                   STATUS
                ========================= */

                tonConnectUI.onStatusChange(
                    function(wallet) {

                        console.log(
                            "CHUBBYX: WALLET STATUS",
                            wallet
                        );

                        updateWalletUI(
                            wallet
                        );
                    }
                );


                /* =========================
                   RESTORE
                ========================= */

                try {

                    await tonConnectUI
                        .connectionRestored;

                } catch (error) {

                    console.log(
                        "CHUBBYX: RESTORE ERROR",
                        error
                    );
                }


                updateWalletUI(
                    tonConnectUI.wallet
                );


                console.log(
                    "CHUBBYX: TON CONNECT READY"
                );


                return tonConnectUI;


            } catch (error) {

                console.error(
                    "CHUBBYX: TON CONNECT ERROR",
                    error
                );


                tonConnectUI =
                    null;

                window.tonConnectUI =
                    null;


                showWalletError(
                    error &&
                    error.message
                        ? error.message
                        : String(error)
                );


                return null;

            } finally {

                tonConnectStarting =
                    null;
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


        if (disconnect) {

            disconnect.style.display =
                "none";
        }
    }
}


/* =========================================
   ERROR
========================================= */

function showWalletError(message) {

    const box =
        document.querySelector(
            ".cx-box"
        );

    if (!box) {
        return;
    }


    let errorBox =
        document.getElementById(
            "cx-wallet-error"
        );


    if (!errorBox) {

        errorBox =
            document.createElement(
                "div"
            );

        errorBox.id =
            "cx-wallet-error";

        errorBox.className =
            "cx-error";

        box.appendChild(
            errorBox
        );
    }


    errorBox.textContent =
        "TON Connect Error: " +
        message;
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
            "CHUBBYX: DISCONNECT ERROR",
            error
        );


        showWalletError(
            error &&
            error.message
                ? error.message
                : String(error)
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


    /* CLOSE TON MODAL */

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
            "CHUBBYX: CLOSE MODAL ERROR",
            error
        );
    }


    /* RETURN TO HOME */

    if (
        typeof window.switchPage ===
            "function"
    ) {

        window.switchPage("home");
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
    "CHUBBYX: NEW WALLET.JS LOADED"
);