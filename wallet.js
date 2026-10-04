/* =========================================
   CHUBBYX — WALLET.JS
   FULL VERSION
========================================= */

let tonConnectUI = null;
let tonConnectReady = false;
let tonConnectStarting = null;
let walletOpening = false;


/* =========================================
   TON CONNECT SETTINGS
========================================= */

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

const TWA_RETURN_URL =
    "https://t.me/ChubbyX_Coin_bot/chubbyx";


/* =========================================
   WALLET PAGE
========================================= */

function walletPage() {

    console.log("CHUBBYX: walletPage()");

    const page =
        document.getElementById("wallet-page");

    if (!page) {
        console.error(
            "CHUBBYX: wallet-page NOT FOUND"
        );
        return;
    }


    page.innerHTML = `

        <div class="chubbyx-wallet-inner">

            <button
                id="chubbyx-wallet-back"
                type="button"
                class="chubbyx-wallet-back"
            >
                ‹
            </button>


            <div class="chubbyx-wallet-title">

                <h2>
                    Wallet
                </h2>

                <p id="chubbyx-wallet-message">
                    Connect your TON wallet
                </p>

            </div>


            <div class="chubbyx-wallet-box">

                <div
                    id="chubbyx-wallet-status"
                    class="chubbyx-wallet-status"
                >
                    Not Connected
                </div>


                <button
                    id="chubbyx-connect-btn"
                    type="button"
                    class="chubbyx-wallet-btn chubbyx-connect-btn"
                >
                    Connect Wallet
                </button>


                <button
                    id="chubbyx-disconnect-btn"
                    type="button"
                    class="chubbyx-wallet-btn chubbyx-disconnect-btn"
                    style="display:none;"
                >
                    Disconnect
                </button>

            </div>


            <button
                id="chubbyx-back-home"
                type="button"
                class="chubbyx-back-home"
            >
                Back to Home
            </button>

        </div>

    `;


    addWalletStyles();


    const connectBtn =
        document.getElementById(
            "chubbyx-connect-btn"
        );

    const disconnectBtn =
        document.getElementById(
            "chubbyx-disconnect-btn"
        );

    const backBtn =
        document.getElementById(
            "chubbyx-wallet-back"
        );

    const backHome =
        document.getElementById(
            "chubbyx-back-home"
        );


    if (connectBtn) {

        connectBtn.onclick =
            function (event) {

                openWallet(event);

            };

    }


    if (disconnectBtn) {

        disconnectBtn.onclick =
            function (event) {

                disconnectWallet(event);

            };

    }


    if (backBtn) {

        backBtn.onclick =
            function (event) {

                goHome(event);

            };

    }


    if (backHome) {

        backHome.onclick =
            function (event) {

                goHome(event);

            };

    }


    updateWalletUI(
        tonConnectUI
            ? tonConnectUI.wallet
            : null
    );


    startTonConnect();

}


/* =========================================
   WALLET STYLES
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
        document.createElement("style");


    style.id =
        "chubbyx-wallet-style";


    style.textContent = `

        .chubbyx-wallet-inner {

            position: relative;

            width: 100%;

            min-height: 100%;

            padding:
                70px 20px 100px;

            text-align: center;

            color: white;

        }


        .chubbyx-wallet-back {

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

            line-height: 45px;

            display: flex;

            align-items: center;

            justify-content: center;

            cursor: pointer;

            z-index: 99999;

            -webkit-tap-highlight-color:
                transparent;

            touch-action: manipulation;

        }


        .chubbyx-wallet-title {

            text-align: center;

            margin-top: 10px;

        }


        .chubbyx-wallet-title h2 {

            margin: 0;

            font-size: 28px;

            color: #eeb308;

        }


        .chubbyx-wallet-title p {

            margin-top: 8px;

            color: #aaa;

            font-size: 14px;

        }


        .chubbyx-wallet-box {

            width: 100%;

            max-width: 400px;

            margin:
                35px auto 0;

            padding: 25px 20px;

            border-radius: 20px;

            background:
                rgba(255,255,255,0.07);

            backdrop-filter:
                blur(10px);

            -webkit-backdrop-filter:
                blur(10px);

        }


        .chubbyx-wallet-status {

            color: white;

            font-size: 15px;

            margin-bottom: 20px;

            word-break: break-word;

        }


        .chubbyx-wallet-btn {

            width: 100%;

            max-width: 320px;

            padding: 15px;

            border: none;

            border-radius: 14px;

            font-size: 16px;

            font-weight: bold;

            cursor: pointer;

            -webkit-tap-highlight-color:
                transparent;

            touch-action: manipulation;

        }


        .chubbyx-connect-btn {

            background: #ffffff;

            color: #111111;

        }


        .chubbyx-disconnect-btn {

            background: #ff4d4d;

            color: white;

        }


        .chubbyx-back-home {

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

            z-index: 9999;

            -webkit-tap-highlight-color:
                transparent;

            touch-action: manipulation;

        }

    `;


    document.head.appendChild(style);

}


/* =========================================
   WAIT FOR TON CONNECT SDK
========================================= */

function waitForTonConnectSDK() {

    return new Promise(
        function (resolve) {

            if (
                window.TON_CONNECT_UI &&
                window.TON_CONNECT_UI.TonConnectUI
            ) {

                resolve(true);

                return;

            }


            let attempts = 0;


            const timer =
                setInterval(
                    function () {

                        attempts++;


                        if (
                            window.TON_CONNECT_UI &&
                            window.TON_CONNECT_UI.TonConnectUI
                        ) {

                            clearInterval(timer);

                            resolve(true);

                            return;

                        }


                        if (attempts >= 150) {

                            clearInterval(timer);

                            console.error(
                                "CHUBBYX: TON Connect SDK not found"
                            );

                            resolve(false);

                        }

                    },
                    100
                );

        }
    );

}


/* =========================================
   START TON CONNECT
========================================= */

async function startTonConnect() {

    if (
        tonConnectUI &&
        tonConnectReady
    ) {

        updateWalletUI(
            tonConnectUI.wallet
        );

        return tonConnectUI;

    }


    if (tonConnectStarting) {

        return tonConnectStarting;

    }


    tonConnectStarting =
        (async function () {

            try {

                console.log(
                    "CHUBBYX: Starting TON Connect..."
                );


                const sdkReady =
                    await waitForTonConnectSDK();


                if (!sdkReady) {

                    console.error(
                        "CHUBBYX: SDK unavailable"
                    );

                    updateWalletUI(null);

                    return null;

                }


                if (
                    !window.TON_CONNECT_UI ||
                    !window.TON_CONNECT_UI.TonConnectUI
                ) {

                    return null;

                }


                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI(
                        {
                            manifestUrl:
                                MANIFEST_URL
                        }
                    );


                window.tonConnectUI =
                    tonConnectUI;


                tonConnectUI.uiOptions = {

                    twaReturnUrl:
                        TWA_RETURN_URL

                };


                tonConnectUI.onStatusChange(
                    function (wallet) {

                        console.log(
                            "CHUBBYX wallet status:",
                            wallet
                        );

                        updateWalletUI(
                            wallet
                        );

                    }
                );


                try {

                    await tonConnectUI.connectionRestored;

                } catch (error) {

                    console.log(
                        "CHUBBYX restore:",
                        error
                    );

                }


                tonConnectReady = true;


                updateWalletUI(
                    tonConnectUI.wallet
                );


                console.log(
                    "CHUBBYX: TON Connect READY"
                );


                return tonConnectUI;


            } catch (error) {

                console.error(
                    "CHUBBYX TON Connect ERROR:",
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
   OPEN WALLET
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


    try {

        console.log(
            "CHUBBYX: Connect clicked"
        );


        const ui =
            await startTonConnect();


        if (!ui) {

            console.error(
                "CHUBBYX: TON Connect not ready"
            );

            return;

        }


        if (ui.wallet) {

            updateWalletUI(
                ui.wallet
            );

            return;

        }


        console.log(
            "CHUBBYX: Opening wallet selector..."
        );


        await ui.openModal();


    } catch (error) {

        console.error(
            "CHUBBYX openWallet ERROR:",
            error
        );

    } finally {

        walletOpening = false;

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
            "CHUBBYX disconnect ERROR:",
            error
        );

    }

}


/* =========================================
   UPDATE WALLET UI
========================================= */

function updateWalletUI(wallet) {

    const status =
        document.getElementById(
            "chubbyx-wallet-status"
        );

    const connectBtn =
        document.getElementById(
            "chubbyx-connect-btn"
        );

    const disconnectBtn =
        document.getElementById(
            "chubbyx-disconnect-btn"
        );

    const message =
        document.getElementById(
            "chubbyx-wallet-message"
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


        if (connectBtn) {

            connectBtn.style.display =
                "none";

        }


        if (disconnectBtn) {

            disconnectBtn.style.display =
                "block";

        }

    } else {

        status.textContent =
            "Not Connected";


        if (message) {

            message.textContent =
                "Connect your TON wallet";

        }


        if (connectBtn) {

            connectBtn.style.display =
                "block";

        }


        if (disconnectBtn) {

            disconnectBtn.style.display =
                "none";

        }

    }

}


/* =========================================
   GO HOME
========================================= */

async function goHome(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    console.log(
        "CHUBBYX: Going Home..."
    );


    try {

        if (
            tonConnectUI &&
            typeof tonConnectUI.closeModal ===
                "function"
        ) {

            await tonConnectUI.closeModal();

        }

    } catch (error) {

        console.log(
            "CHUBBYX close modal:",
            error
        );

    }


    walletOpening = false;


    if (
        typeof window.switchPage ===
            "function"
    ) {

        window.switchPage(
            "home"
        );

        return;

    }


    const wallet =
        document.getElementById(
            "wallet-page"
        );

    const home =
        document.getElementById(
            "home-layout"
        );


    if (wallet) {

        wallet.classList.remove(
            "active"
        );

    }


    if (home) {

        home.style.display =
            "flex";

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


/* =========================================
   READY
========================================= */

console.log(
    "CHUBBYX: wallet.js loaded successfully"
);