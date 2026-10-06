/* =========================================
   CHUBBYX — WALLET.JS
   COMPLETE VERSION
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

    const page = document.getElementById("wallet-page");

    if (!page) {
        console.error("CHUBBYX: wallet-page NOT FOUND");
        return;
    }


    /* -----------------------------------------
       CREATE PAGE ONLY ONCE
    ----------------------------------------- */

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

                    <button
                        id="cx-connect"
                        type="button"
                        class="cx-connect"
                    >
                        Connect Wallet
                    </button>

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

            backButton.onclick = function(event) {

                event.preventDefault();
                event.stopPropagation();

                goHome();
            };
        }


        /* -----------------------------------------
           HOME
        ----------------------------------------- */

        if (homeButton) {

            homeButton.onclick = function(event) {

                event.preventDefault();
                event.stopPropagation();

                goHome();
            };
        }


        /* -----------------------------------------
           CONNECT
        ----------------------------------------- */

        if (connectButton) {

            connectButton.onclick = async function(event) {

                event.preventDefault();
                event.stopPropagation();

                if (walletOpening) {
                    return;
                }

                walletOpening = true;

                console.log(
                    "CHUBBYX: CONNECT BUTTON CLICKED"
                );


                try {

                    const ui =
                        await startTonConnect();


                    if (!ui) {

                        showWalletError(
                            "TON Connect could not start."
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
                        "CHUBBYX: CONNECT ERROR",
                        error
                    );


                    showWalletError(
                        error &&
                        error.message
                            ? error.message
                            : String(error)
                    );

                } finally {

                    setTimeout(function() {

                        walletOpening = false;

                    }, 700);
                }
            };
        }


        /* -----------------------------------------
           DISCONNECT
        ----------------------------------------- */

        if (disconnectButton) {

            disconnectButton.onclick =
                disconnectWallet;
        }


        walletPageCreated = true;
    }


    /* -----------------------------------------
       START TON CONNECT
    ----------------------------------------- */

    startTonConnect();
}


/* =========================================
   STYLES
========================================= */

function addWalletStyles() {

    if (document.getElementById("cx-wallet-style")) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "cx-wallet-style";


    style.textContent = `

        /* WALLET PAGE */

        #wallet-page {
            overflow: hidden !important;
            overflow-x: hidden !important;
            overflow-y: hidden !important;

            touch-action: none !important;

            -webkit-overflow-scrolling: auto !important;

            position: relative !important;

            width: 100% !important;
            height: 100% !important;
        }


        /* MAIN WALLET */

        .cx-wallet {

            position: relative;

            box-sizing: border-box;

            width: 100%;
            min-height: 100%;

            padding:
                70px 20px 110px;

            text-align: center;

            color: white;

            overflow: hidden;

            touch-action: none;
        }


        /* TITLE */

        .cx-wallet h2 {

            margin: 0;

            font-size: 28px;

            color: #eeb308;
        }


        /* MESSAGE */

        .cx-wallet > p {

            margin-top: 8px;

            color: #aaa;

            font-size: 14px;
        }


        /* BACK */

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

            touch-action: manipulation;

            -webkit-tap-highlight-color:
                transparent;
        }


        /* BOX */

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

            touch-action: none;
        }


        /* STATUS */

        .cx-status {

            color: white;

            font-size: 15px;

            margin-bottom: 20px;
        }


        /* CONNECT */

        .cx-connect {

            display: block;

            width: 100%;

            max-width: 320px;

            min-height: 52px;

            margin: 0 auto;

            padding:
                15px 20px;

            box-sizing: border-box;

            border: none;

            border-radius: 14px;

            background: #2196F3;

            color: white;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            position: relative;

            z-index: 999999;

            touch-action: manipulation !important;

            -webkit-tap-highlight-color:
                transparent;

            -webkit-user-select: none;

            user-select: none;
        }


        .cx-connect:active {

            transform: scale(0.98);
        }


        /* DISCONNECT */

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


        /* HOME */

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

            touch-action: manipulation;

            -webkit-tap-highlight-color:
                transparent;
        }


        /* ERROR */

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
   START TON CONNECT
========================================= */

async function startTonConnect() {

    /* ALREADY CREATED */

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

                /* CHECK SDK */

                if (
                    !window.TON_CONNECT_UI ||
                    !window.TON_CONNECT_UI.TonConnectUI
                ) {

                    console.error(
                        "CHUBBYX: TON CONNECT SDK NOT FOUND"
                    );

                    showWalletError(
                        "TON Connect SDK not loaded."
                    );

                    return null;
                }


                console.log(
                    "CHUBBYX: CREATING TON CONNECT"
                );


                /* CREATE TON CONNECT */

                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL,

                        buttonRootId:
                            null
                    });


                window.tonConnectUI =
                    tonConnectUI;


                /* OPTIONS */

                tonConnectUI.uiOptions = {

                    actionsConfiguration: {

                        twaReturnUrl:
                            TWA_RETURN_URL
                    },

                    uiPreferences: {

                        theme:
                            "DARK"
                    }
                };


                /* STATUS */

                tonConnectUI.onStatusChange(
                    function(wallet) {

                        console.log(
                            "CHUBBYX: WALLET STATUS",
                            wallet
                        );

                        updateWalletUI(wallet);
                    }
                );


                /* RESTORE */

                try {

                    await tonConnectUI
                        .connectionRestored;

                } catch (restoreError) {

                    console.log(
                        "CHUBBYX: RESTORE ERROR",
                        restoreError
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
                    "CHUBBYX: TON CONNECT CREATE ERROR",
                    error
                );


                tonConnectUI = null;

                window.tonConnectUI = null;


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
   UPDATE UI
========================================= */

function updateWalletUI(wallet) {

    const status =
        document.getElementById("cx-status");

    const message =
        document.getElementById("cx-message");

    const connect =
        document.getElementById("cx-connect");

    const disconnect =
        document.getElementById("cx-disconnect");


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
   ERROR MESSAGE
========================================= */

function showWalletError(message) {

    const box =
        document.querySelector(".cx-box");

    if (!box) {
        return;
    }


    let errorBox =
        document.getElementById(
            "cx-wallet-error"
        );


    if (!errorBox) {

        errorBox =
            document.createElement("div");

        errorBox.id =
            "cx-wallet-error";

        errorBox.className =
            "cx-error";

        box.appendChild(errorBox);
    }


    errorBox.textContent =
        "TON Connect Error: " + message;
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
    "CHUBBYX: COMPLETE WALLET.JS LOADED"
);