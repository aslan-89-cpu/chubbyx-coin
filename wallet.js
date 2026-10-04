/* =========================================
   CHUBBYX — WALLET.JS
   FINAL TON CONNECT VERSION
========================================= */

let tonConnectUI = null;
let tonConnectStarting = null;

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
        return;
    }


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


                <!-- TON CONNECT OWNS THIS BUTTON -->

                <div
                    id="chubbyx-ton-connect"
                    class="cx-ton-connect">
                </div>


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


    document.getElementById(
        "cx-wallet-back"
    ).onclick = goHome;


    document.getElementById(
        "cx-home"
    ).onclick = goHome;


    document.getElementById(
        "cx-disconnect"
    ).onclick = disconnectWallet;


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
            overflow-y: auto;
            overflow-x: hidden;
            touch-action: pan-y;
        }


        .cx-wallet {
            position: relative;
            width: 100%;
            min-height: 100%;
            padding: 70px 20px 100px;
            text-align: center;
            color: white;
        }


        .cx-back {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 45px;
            height: 45px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,.12);
            color: white;
            font-size: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20;
            cursor: pointer;
            touch-action: manipulation;
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


        .cx-box {
            width: 100%;
            max-width: 400px;
            margin: 35px auto 0;
            padding: 25px 20px;
            border-radius: 20px;
            background: rgba(255,255,255,.07);
        }


        .cx-status {
            color: white;
            font-size: 15px;
            margin-bottom: 20px;
        }


        /*
         * TON CONNECT CONTAINER
         */

        #chubbyx-ton-connect {
            width: 100%;
            min-height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 10;
        }


        /*
         * DO NOT BLOCK TON CONNECT CLICK
         */

        #chubbyx-ton-connect * {
            pointer-events: auto;
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
            background: rgba(255,255,255,.12);
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 20;
        }

    `;


    document.head.appendChild(style);

}


/* =========================================
   TON CONNECT START
========================================= */

async function startTonConnect() {

    /*
     * Already created
     */

    if (tonConnectUI) {

        /*
         * The page was rebuilt.
         * Make sure the button is rendered again.
         */

        try {

            const root =
                document.getElementById(
                    "chubbyx-ton-connect"
                );

            if (
                root &&
                root.children.length === 0
            ) {

                tonConnectUI.uiOptions = {

                    twaReturnUrl:
                        TWA_RETURN_URL

                };

            }

        } catch (e) {

            console.log(
                "CHUBBYX existing UI:",
                e
            );

        }

        return tonConnectUI;
    }


    /*
     * Prevent double initialization
     */

    if (tonConnectStarting) {
        return tonConnectStarting;
    }


    tonConnectStarting =
        (async () => {

            try {

                if (
                    !window.TON_CONNECT_UI ||
                    !window.TON_CONNECT_UI.TonConnectUI
                ) {

                    console.error(
                        "CHUBBYX: TON CONNECT SDK NOT FOUND"
                    );

                    return null;
                }


                const root =
                    document.getElementById(
                        "chubbyx-ton-connect"
                    );


                if (!root) {

                    console.error(
                        "CHUBBYX: connect root not found"
                    );

                    return null;
                }


                /*
                 * CREATE TON CONNECT
                 */

                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL,

                        buttonRootId:
                            "chubbyx-ton-connect"

                    });


                /*
                 * GLOBAL
                 */

                window.tonConnectUI =
                    tonConnectUI;


                /*
                 * TELEGRAM MINI APP
                 */

                tonConnectUI.uiOptions = {

                    twaReturnUrl:
                        TWA_RETURN_URL,

                    uiPreferences: {

                        colorsSet: {

                            DARK: {

                                connectButton: {

                                    background:
                                        "#2196F3"

                                }

                            },

                            LIGHT: {

                                connectButton: {

                                    background:
                                        "#2196F3"

                                }

                            }

                        }

                    }

                };


                /*
                 * WALLET STATUS
                 */

                tonConnectUI.onStatusChange(
                    function(wallet) {

                        updateWalletUI(
                            wallet
                        );

                    }
                );


                /*
                 * WAIT FOR RESTORE
                 */

                try {

                    await tonConnectUI
                        .connectionRestored;

                } catch (e) {

                    console.log(
                        "CHUBBYX restore:",
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
                    "CHUBBYX TON CONNECT ERROR:",
                    error
                );

                tonConnectUI =
                    null;

                window.tonConnectUI =
                    null;

                return null;


            } finally {

                tonConnectStarting =
                    null;

            }

        })();


    return tonConnectStarting;

}


/* =========================================
   UPDATE WALLET
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
            "CHUBBYX disconnect:",
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
    "CHUBBYX: wallet.js FINAL LOADED"
);