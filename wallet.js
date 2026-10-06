/* =========================================
   CHUBBYX — WALLET.JS
   FINAL TON CONNECT VERSION
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
   CREATE WALLET PAGE
========================================= */

function walletPage() {

    const page =
        document.getElementById("wallet-page");

    if (!page) {
        console.error(
            "CHUBBYX: wallet-page not found"
        );
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
            document.getElementById(
                "cx-wallet-back"
            );

        const homeButton =
            document.getElementById(
                "cx-home"
            );

        const connectButton =
            document.getElementById(
                "cx-connect"
            );

        const disconnectButton =
            document.getElementById(
                "cx-disconnect"
            );


        /* =====================================
           BACK
        ===================================== */

        if (backButton) {

            backButton.onclick = function(e) {

                e.preventDefault();
                e.stopPropagation();

                goHome();
            };
        }


        /* =====================================
           HOME
        ===================================== */

        if (homeButton) {

            homeButton.onclick = function(e) {

                e.preventDefault();
                e.stopPropagation();

                goHome();
            };
        }


        /* =====================================
           CONNECT
        ===================================== */

        if (connectButton) {

            connectButton.onclick =
                async function(e) {

                    e.preventDefault();
                    e.stopPropagation();

                    console.log(
                        "CHUBBYX: CONNECT CLICK"
                    );

                    if (walletOpening) {
                        console.log(
                            "CHUBBYX: ALREADY OPENING"
                        );
                        return;
                    }

                    walletOpening = true;

                    try {

                        const ui =
                            await startTonConnect();

                        if (!ui) {

                            throw new Error(
                                "TON Connect UI failed to initialize"
                            );
                        }

                        console.log(
                            "CHUBBYX: UI READY"
                        );

                        console.log(
                            "CHUBBYX: OPENING MODAL"
                        );

                        await ui.openModal();

                        console.log(
                            "CHUBBYX: MODAL OPENED"
                        );

                    } catch (error) {

                        console.error(
                            "CHUBBYX CONNECT ERROR:",
                            error
                        );

                        showWalletError(
                            "Wallet connection failed."
                        );

                    } finally {

                        setTimeout(
                            function() {
                                walletOpening = false;
                            },
                            800
                        );
                    }
                };
        }


        /* =====================================
           DISCONNECT
        ===================================== */

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
   TON CONNECT INITIALIZATION
========================================= */

async function startTonConnect() {

    if (tonConnectUI) {
        return tonConnectUI;
    }

    if (tonConnectStarting) {
        return tonConnectStarting;
    }

    tonConnectStarting =
        new Promise(
            async function(resolve, reject) {

                try {

                    console.log(
                        "CHUBBYX: STARTING TON CONNECT"
                    );

                    if (
                        !window.TON_CONNECT_UI
                    ) {

                        throw new Error(
                            "TON_CONNECT_UI library not loaded"
                        );
                    }


                    const TonConnectUI =
                        window
                            .TON_CONNECT_UI
                            .TonConnectUI;


                    if (!TonConnectUI) {

                        throw new Error(
                            "TonConnectUI constructor not found"
                        );
                    }


                    console.log(
                        "CHUBBYX: CREATING TON CONNECT UI"
                    );


                    tonConnectUI =
                        new TonConnectUI({
                            manifestUrl:
                                MANIFEST_URL
                        });


                    /* =================================
                       TELEGRAM RETURN URL
                    ================================= */

                    try {

                        tonConnectUI.uiOptions = {

                            twaReturnUrl:
                                TWA_RETURN_URL
                        };

                    } catch (e) {

                        console.log(
                            "CHUBBYX: uiOptions skipped",
                            e
                        );
                    }


                    /* =================================
                       STATUS
                    ================================= */

                    tonConnectUI.onStatusChange(
                        function(wallet) {

                            console.log(
                                "CHUBBYX WALLET STATUS:",
                                wallet
                            );

                            updateWalletStatus(
                                wallet
                            );
                        }
                    );


                    console.log(
                        "CHUBBYX: TON CONNECT READY"
                    );


                    resolve(
                        tonConnectUI
                    );

                } catch (error) {

                    console.error(
                        "CHUBBYX: TON CONNECT INIT ERROR:",
                        error
                    );

                    tonConnectUI = null;

                    reject(error);
                }
            }
        );

    try {

        return await tonConnectStarting;

    } finally {

        tonConnectStarting = null;
    }
}


/* =========================================
   WALLET STATUS
========================================= */

function updateWalletStatus(wallet) {

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


    if (!wallet) {

        if (status)
            status.innerText =
                "Not Connected";

        if (message)
            message.innerText =
                "Connect your TON wallet";

        if (connect)
            connect.style.display =
                "block";

        if (disconnect)
            disconnect.style.display =
                "none";

        return;
    }


    let address = "";

    if (
        wallet.account &&
        wallet.account.address
    ) {

        address =
            wallet.account.address;
    }


    if (status) {

        status.innerText =
            address
                ? shortenAddress(address)
                : "Connected";
    }


    if (message) {

        message.innerText =
            "TON wallet connected";
    }


    if (connect)
        connect.style.display =
            "none";


    if (disconnect)
        disconnect.style.display =
            "block";
}


/* =========================================
   SHORT ADDRESS
========================================= */

function shortenAddress(address) {

    if (!address) {
        return "Connected";
    }

    if (address.length < 14) {
        return address;
    }

    return (
        address.substring(0, 6) +
        "..." +
        address.substring(
            address.length - 6
        )
    );
}


/* =========================================
   DISCONNECT
========================================= */

async function disconnectWallet() {

    try {

        if (
            tonConnectUI &&
            typeof
                tonConnectUI.disconnectWallet
                === "function"
        ) {

            await tonConnectUI
                .disconnectWallet();
        }

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

function goHome() {

    try {

        if (
            tonConnectUI &&
            typeof
                tonConnectUI.closeModal
                === "function"
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
   ERROR
========================================= */

function showWalletError(message) {

    const box =
        document.getElementById(
            "cx-message"
        );

    if (box) {

        box.innerText =
            message;

        setTimeout(
            function() {

                box.innerText =
                    "Connect your TON wallet";

            },
            3000
        );
    }
}


/* =========================================
   CSS
========================================= */

function addWalletStyles() {

    if (
        document.getElementById(
            "chubbyx-wallet-style"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "chubbyx-wallet-style";

    style.innerHTML = `

        #wallet-page {
            overflow: hidden !important;
            touch-action: auto !important;
            position: fixed !important;
            width: 100vw !important;
            height: calc(100vh - 85px) !important;
            z-index: 1500 !important;
        }

        .cx-wallet {
            width: 100%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            padding-top: 20px;
        }

        .cx-back {
            position: absolute;
            left: 10px;
            top: 10px;
            width: 46px;
            height: 46px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            color: white;
            font-size: 34px;
            line-height: 40px;
            cursor: pointer;
            z-index: 999999;
            touch-action: manipulation;
        }

        .cx-wallet h2 {
            margin-top: 20px;
            color: #eeb308;
            font-size: 28px;
        }

        .cx-wallet p {
            margin-top: 10px;
            color: #aaa;
            font-size: 15px;
        }

        .cx-box {
            width: 90%;
            max-width: 420px;
            margin-top: 40px;
            padding: 25px;
            border-radius: 20px;
            background: rgba(255,255,255,0.06);
            text-align: center;
        }

        .cx-status {
            margin-bottom: 20px;
            color: white;
            font-weight: bold;
        }

        .cx-connect {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 14px;
            background: #eeb308;
            color: #000;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            touch-action: manipulation;
        }

        .cx-connect:active {
            transform: scale(0.97);
        }

        .cx-disconnect {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 14px;
            background: #333;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        .cx-home {
            margin-top: 25px;
            padding: 12px 25px;
            border: none;
            border-radius: 12px;
            background: rgba(255,255,255,0.08);
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

    `;

    document.head.appendChild(style);
}


/* =========================================
   GLOBAL
========================================= */

window.walletPage =
    walletPage;

window.startTonConnect =
    startTonConnect;

console.log(
    "CHUBBYX: wallet.js loaded"
);