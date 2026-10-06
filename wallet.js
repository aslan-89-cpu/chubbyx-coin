/* =========================================
   CHUBBYX — WALLET.JS
   DIAGNOSTIC VERSION
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
        console.error("CHUBBYX: wallet-page NOT FOUND");
        return;
    }


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


        const backButton =
            document.getElementById("cx-wallet-back");

        const homeButton =
            document.getElementById("cx-home");

        const connectButton =
            document.getElementById("cx-connect");

        const disconnectButton =
            document.getElementById("cx-disconnect");


        /* =====================================
           BACK
        ===================================== */

        if (backButton) {

            backButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "CHUBBYX: BACK CLICK"
                    );

                    goHome();
                },
                {
                    passive: false
                }
            );
        }


        /* =====================================
           HOME
        ===================================== */

        if (homeButton) {

            homeButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    goHome();
                },
                {
                    passive: false
                }
            );
        }


        /* =====================================
           CONNECT
        ===================================== */

        if (connectButton) {

            console.log(
                "CHUBBYX: CONNECT BUTTON FOUND"
            );


            connectButton.addEventListener(
                "pointerdown",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "CHUBBYX: CONNECT POINTERDOWN"
                    );

                },
                {
                    passive: false
                }
            );


            connectButton.addEventListener(
                "click",
                async function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    console.log(
                        "CHUBBYX: ======================="
                    );

                    console.log(
                        "CHUBBYX: CONNECT CLICK START"
                    );


                    const message =
                        document.getElementById(
                            "cx-message"
                        );


                    if (message) {

                        message.textContent =
                            "Connect button clicked...";

                        message.style.color =
                            "#eeb308";
                    }


                    if (walletOpening) {

                        console.log(
                            "CHUBBYX: ALREADY OPENING"
                        );

                        return;
                    }


                    walletOpening = true;


                    try {

                        console.log(
                            "CHUBBYX: START TON CONNECT"
                        );


                        const ui =
                            await startTonConnect();


                        console.log(
                            "CHUBBYX: START RESULT:",
                            ui
                        );


                        if (!ui) {

                            showWalletError(
                                "TonConnect UI is NULL"
                            );

                            return;
                        }


                        console.log(
                            "CHUBBYX: CALL openModal()"
                        );


                        if (
                            typeof ui.openModal !==
                            "function"
                        ) {

                            showWalletError(
                                "openModal() does not exist"
                            );

                            return;
                        }


                        await ui.openModal();


                        console.log(
                            "CHUBBYX: openModal() FINISHED"
                        );


                    } catch (error) {

                        console.error(
                            "CHUBBYX: CONNECT ERROR:",
                            error
                        );


                        showWalletError(
                            error &&
                            error.message
                                ? error.message
                                : String(error)
                        );

                    } finally {

                        setTimeout(
                            function() {

                                walletOpening =
                                    false;

                            },
                            700
                        );
                    }

                },
                {
                    passive: false
                }
            );

        } else {

            console.error(
                "CHUBBYX: CONNECT BUTTON NOT FOUND"
            );
        }


        /* =====================================
           DISCONNECT
        ===================================== */

        if (disconnectButton) {

            disconnectButton.addEventListener(
                "click",
                disconnectWallet,
                {
                    passive: false
                }
            );
        }


        walletPageCreated = true;
    }


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

        #wallet-page {

            position: fixed !important;

            top: 0 !important;
            left: 0 !important;

            width: 100vw !important;
            height: 100vh !important;

            overflow: hidden !important;

            touch-action: none !important;

            z-index: 9999 !important;

            background: #130f26 !important;
        }


        .cx-wallet {

            position: fixed !important;

            inset: 0 !important;

            width: 100% !important;
            height: 100% !important;

            padding:
                70px 20px 100px !important;

            overflow: hidden !important;

            touch-action: none !important;

            text-align: center;

            color: white;

            background: #130f26;

            z-index: 10000;
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

            position: absolute !important;

            top: 15px !important;
            left: 15px !important;

            width: 45px !important;
            height: 45px !important;

            padding: 0 !important;

            border: none !important;

            border-radius: 50% !important;

            background:
                rgba(255,255,255,0.12) !important;

            color: white !important;

            font-size: 34px !important;

            display: flex !important;

            align-items: center !important;
            justify-content: center !important;

            z-index: 999999 !important;

            pointer-events: auto !important;

            touch-action: manipulation !important;
        }


        .cx-box {

            width: 100%;

            max-width: 400px;

            margin: 35px auto 0;

            padding: 25px 20px;

            border-radius: 20px;

            background:
                rgba(255,255,255,0.07);

            touch-action: none;
        }


        .cx-status {

            color: white;

            font-size: 15px;

            margin-bottom: 20px;
        }


        .cx-connect {

            display: block !important;

            width: 100% !important;

            max-width: 320px !important;

            min-height: 52px !important;

            margin: 0 auto !important;

            padding: 15px 20px !important;

            border: none !important;

            border-radius: 14px !important;

            background: #2196F3 !important;

            color: white !important;

            font-size: 16px !important;

            font-weight: bold !important;

            position: relative !important;

            z-index: 9999999 !important;

            pointer-events: auto !important;

            touch-action: manipulation !important;

            cursor: pointer !important;

            -webkit-tap-highlight-color:
                transparent !important;
        }


        .cx-connect:active {

            transform: scale(0.98);
        }


        .cx-disconnect {

            width: 100%;

            max-width: 320px;

            margin: 15px auto 0;

            padding: 15px;

            border: none;

            border-radius: 14px;

            background: #ff4d4d;

            color: white;

            font-size: 16px;

            font-weight: bold;

            z-index: 9999999;

            position: relative;

            touch-action: manipulation;
        }


        .cx-home {

            position: absolute !important;

            left: 20px !important;
            right: 20px !important;

            bottom: 20px !important;

            width:
                calc(100% - 40px) !important;

            padding: 15px !important;

            border: none !important;

            border-radius: 15px !important;

            background:
                rgba(255,255,255,0.12) !important;

            color: white !important;

            font-size: 16px !important;

            font-weight: bold !important;

            z-index: 9999999 !important;

            pointer-events: auto !important;

            touch-action: manipulation !important;
        }


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

    if (tonConnectUI) {

        updateWalletUI(
            tonConnectUI.wallet
        );

        return tonConnectUI;
    }


    if (tonConnectStarting) {

        return tonConnectStarting;
    }


    tonConnectStarting =
        (async function() {

            try {

                console.log(
                    "CHUBBYX: CHECK SDK"
                );


                if (
                    !window.TON_CONNECT_UI ||
                    !window.TON_CONNECT_UI.TonConnectUI
                ) {

                    throw new Error(
                        "TON Connect SDK not loaded"
                    );
                }


                console.log(
                    "CHUBBYX: SDK FOUND"
                );


                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL,

                        buttonRootId:
                            null

                    });


                window.tonConnectUI =
                    tonConnectUI;


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


                tonConnectUI.onStatusChange(
                    function(wallet) {

                        console.log(
                            "CHUBBYX STATUS:",
                            wallet
                        );

                        updateWalletUI(
                            wallet
                        );
                    }
                );


                try {

                    await tonConnectUI
                        .connectionRestored;

                } catch (e) {

                    console.log(
                        "CHUBBYX RESTORE:",
                        e
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
                    "CHUBBYX START ERROR:",
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
   UPDATE UI
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
            "DISCONNECT ERROR:",
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


    try {

        if (
            tonConnectUI &&
            typeof
                tonConnectUI.closeModal
                === "function"
        ) {

            tonConnectUI.closeModal();
        }

    } catch (e) {

        console.log(
            "CLOSE MODAL:",
            e
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
    "CHUBBYX: DIAGNOSTIC WALLET.JS LOADED"
);