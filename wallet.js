/* =========================================
   CHUBBYX — WALLET.JS
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

    if (!page) return;


    if (!walletPageCreated) {

        page.innerHTML = `
            <div class="cx-wallet">

                <button
                    id="cx-wallet-back"
                    class="cx-back"
                    type="button"
                >‹</button>

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

                    <div
                        id="cx-ton-root"
                        class="cx-ton-root"
                    ></div>

                    <button
                        id="cx-disconnect"
                        class="cx-disconnect"
                        type="button"
                        style="display:none"
                    >
                        Disconnect
                    </button>

                </div>

                <button
                    id="cx-home"
                    class="cx-home"
                    type="button"
                >
                    Back to Home
                </button>

            </div>
        `;

        addWalletStyles();

        document
            .getElementById("cx-wallet-back")
            .onclick = goHome;

        document
            .getElementById("cx-home")
            .onclick = goHome;

        document
            .getElementById("cx-disconnect")
            .onclick = disconnectWallet;

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
    ) return;


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

            height:
                calc(100vh - 85px) !important;

            overflow: hidden !important;

            background: #130f26 !important;

            z-index: 9999 !important;
        }


        .cx-wallet {

            position: relative !important;

            width: 100% !important;

            height: 100% !important;

            box-sizing: border-box;

            padding:
                70px 20px 90px;

            text-align: center;

            color: white;

            overflow: hidden !important;
        }


        .cx-wallet h2 {

            margin: 0;

            color: #eeb308;

            font-size: 28px;
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
                rgba(255,255,255,.12);

            color: white;

            font-size: 34px;

            display: flex;

            align-items: center;
            justify-content: center;

            z-index: 999999;

            cursor: pointer;

            touch-action: manipulation;
        }


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
                rgba(255,255,255,.07);
        }


        .cx-status {

            margin-bottom: 20px;

            color: white;

            font-size: 15px;
        }


        .cx-ton-root {

            width: 100%;

            min-height: 52px;

            display: flex;

            justify-content: center;

            align-items: center;

            position: relative;

            z-index: 999999;
        }


        .cx-ton-root button {

            min-height: 52px !important;

            border-radius: 14px !important;

            pointer-events: auto !important;

            cursor: pointer !important;
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
        }


        .cx-home {

            position: absolute;

            left: 20px;
            right: 20px;
            bottom: 15px;

            width:
                calc(100% - 40px);

            padding: 15px;

            border: none;

            border-radius: 15px;

            background:
                rgba(255,255,255,.12);

            color: white;

            font-size: 16px;

            font-weight: bold;

            z-index: 999999;

            cursor: pointer;

            touch-action: manipulation;
        }

    `;


    document.head.appendChild(style);
}


/* =========================================
   TON CONNECT START
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

                if (
                    !window.TON_CONNECT_UI ||
                    !window.TON_CONNECT_UI.TonConnectUI
                ) {

                    throw new Error(
                        "TON Connect SDK not loaded"
                    );
                }


                const root =
                    document.getElementById(
                        "cx-ton-root"
                    );


                if (!root) {

                    throw new Error(
                        "TON Connect root missing"
                    );
                }


                root.innerHTML = "";


                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL,

                        buttonRootId:
                            "cx-ton-root"
                    });


                window.tonConnectUI =
                    tonConnectUI;


                tonConnectUI.uiOptions = {

                    actionsConfiguration: {

                        twaReturnUrl:
                            TWA_RETURN_URL
                    },

                    uiPreferences: {

                        theme: "DARK"
                    }
                };


                tonConnectUI.onStatusChange(
                    function(wallet) {

                        updateWalletUI(wallet);
                    }
                );


                try {

                    await tonConnectUI
                        .connectionRestored;

                } catch (e) {

                    console.log(
                        "Wallet restore:",
                        e
                    );
                }


                updateWalletUI(
                    tonConnectUI.wallet
                );


                return tonConnectUI;

            } catch (error) {

                console.error(
                    "TON CONNECT ERROR:",
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
   WALLET STATUS
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


    if (!status) return;


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
   DISCONNECT
========================================= */

async function disconnectWallet(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();
    }


    if (!tonConnectUI) return;


    try {

        await tonConnectUI.disconnect();

        updateWalletUI(null);

    } catch (error) {

        console.error(
            "DISCONNECT ERROR:",
            error
        );
    }
}


/* =========================================
   BACK TO HOME
========================================= */

function goHome(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();
    }


    try {

        if (
            tonConnectUI &&
            typeof tonConnectUI.closeModal ===
                "function"
        ) {

            tonConnectUI.closeModal();
        }

    } catch (e) {}


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
    "CHUBBYX WALLET.JS READY"
);