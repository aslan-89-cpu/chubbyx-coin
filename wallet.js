/* =========================================
   CHUBBYX — WALLET.JS
   FIXED VERSION
========================================= */

let tonConnectUI = null;
let walletOpening = false;
let tonConnectReady = false;


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

    const page =
        document.getElementById("wallet-page");

    if (!page) {
        console.error("CHUBBYX: wallet-page not found");
        return;
    }


    /* =====================================
       BUILD PAGE
    ===================================== */

    page.innerHTML = `

        <div class="wallet-inner">

            <!-- BACK BUTTON -->

            <button
                id="wallet-back-top"
                type="button"
                class="wallet-back-top"
            >
                ‹
            </button>


            <!-- TITLE -->

            <div class="wallet-title">

                <h2>Wallet</h2>

                <p id="wallet-message">
                    Connect your TON wallet
                </p>

            </div>


            <!-- WALLET BOX -->

            <div class="wallet-box">

                <div
                    id="wallet-status"
                    class="wallet-status"
                >
                    Not Connected
                </div>


                <button
                    id="connect-wallet-btn"
                    type="button"
                    class="wallet-btn connect-btn"
                >
                    Connect Wallet
                </button>


                <button
                    id="disconnect-wallet-btn"
                    type="button"
                    class="wallet-btn disconnect-btn"
                    style="display:none;"
                >
                    Disconnect
                </button>

            </div>


            <!-- BACK HOME -->

            <button
                id="wallet-back-home"
                type="button"
                class="back-home-btn"
            >
                Back to Home
            </button>

        </div>

    `;


    /* =====================================
       CSS
    ===================================== */

    addWalletStyles();


    /* =====================================
       BUTTONS
    ===================================== */

    const connectBtn =
        document.getElementById(
            "connect-wallet-btn"
        );

    const disconnectBtn =
        document.getElementById(
            "disconnect-wallet-btn"
        );

    const backTop =
        document.getElementById(
            "wallet-back-top"
        );

    const backHome =
        document.getElementById(
            "wallet-back-home"
        );


    /* CONNECT */

    if (connectBtn) {

        connectBtn.addEventListener(
            "click",
            openWallet
        );

    }


    /* DISCONNECT */

    if (disconnectBtn) {

        disconnectBtn.addEventListener(
            "click",
            disconnectWallet
        );

    }


    /* BACK TOP */

    if (backTop) {

        backTop.addEventListener(
            "click",
            goHome
        );

    }


    /* BACK HOME */

    if (backHome) {

        backHome.addEventListener(
            "click",
            goHome
        );

    }


    /* =====================================
       SHOW CURRENT CONNECTION
    ===================================== */

    if (tonConnectUI) {

        updateWalletUI(
            tonConnectUI.wallet
        );

    } else {

        updateWalletUI(null);

    }


    /* =====================================
       START TON CONNECT
    ===================================== */

    startTonConnect();

}


/* =========================================
   WALLET CSS
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

        .wallet-inner {

            position: relative;

            width: 100%;
            min-height: 100%;

            box-sizing: border-box;

            padding:
                75px 20px 100px;

            text-align: center;

        }


        .wallet-back-top {

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

        }


        .wallet-title {

            text-align: center;

            margin-top: 10px;

        }


        .wallet-title h2 {

            margin: 0;

            font-size: 28px;

            color: #eeb308;

        }


        .wallet-title p {

            margin-top: 8px;

            color: #aaa;

            font-size: 14px;

        }


        .wallet-box {

            width: 100%;

            box-sizing: border-box;

            margin-top: 35px;

            padding: 25px 20px;

            border-radius: 20px;

            background:
                rgba(255,255,255,0.07);

            backdrop-filter:
                blur(10px);

            -webkit-backdrop-filter:
                blur(10px);

        }


        .wallet-status {

            color: white;

            font-size: 15px;

            margin-bottom: 20px;

            word-break: break-word;

        }


        .wallet-btn {

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

        }


        .connect-btn {

            background: #ffffff;

            color: #111;

        }


        .disconnect-btn {

            background: #ff4d4d;

            color: white;

        }


        .back-home-btn {

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

        }

    `;


    document.head.appendChild(style);

}


/* =========================================
   WAIT FOR TON CONNECT SDK
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


        let attempts = 0;

        const timer =
            setInterval(() => {

                attempts++;

                if (
                    window.TON_CONNECT_UI &&
                    window.TON_CONNECT_UI.TonConnectUI
                ) {

                    clearInterval(timer);

                    resolve(true);

                    return;

                }


                /* Stop after 15 seconds */

                if (attempts >= 150) {

                    clearInterval(timer);

                    console.error(
                        "CHUBBYX: TON Connect SDK not found"
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

    try {

        /* Already initialized */

        if (tonConnectUI) {

            tonConnectReady = true;

            updateWalletUI(
                tonConnectUI.wallet
            );

            return tonConnectUI;

        }


        /* Wait for SDK */

        const sdkReady =
            await waitForTonConnectSDK();


        if (!sdkReady) {

            updateWalletUI(null);

            return null;

        }


        /* Create TON Connect */

        tonConnectUI =
            new window.TON_CONNECT_UI.TonConnectUI({

                manifestUrl:
                    MANIFEST_URL

            });


        /* Telegram Mini App */

        tonConnectUI.uiOptions = {

            twaReturnUrl:
                TWA_RETURN_URL

        };


        /* Wallet status */

        tonConnectUI.onStatusChange(
            (wallet) => {

                console.log(
                    "CHUBBYX wallet status:",
                    wallet
                );

                updateWalletUI(wallet);

            }
        );


        /* Restore previous connection */

        try {

            await tonConnectUI.connectionRestored;

        } catch (error) {

            console.log(
                "CHUBBYX connection restore:",
                error
            );

        }


        tonConnectReady = true;


        /* Update UI */

        updateWalletUI(
            tonConnectUI.wallet
        );


        return tonConnectUI;


    } catch (error) {

        console.error(
            "CHUBBYX TON Connect initialization:",
            error
        );

        tonConnectUI = null;

        tonConnectReady = false;

        updateWalletUI(null);

        return null;

    }

}


/* =========================================
   CONNECT WALLET
========================================= */

async function openWallet(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();

    }


    /* Prevent double click */

    if (walletOpening) {

        return;

    }


    walletOpening = true;


    try {

        const ui =
            await startTonConnect();


        if (!ui) {

            console.error(
                "CHUBBYX: TON Connect is not ready"
            );

            return;

        }


        /* Already connected */

        if (ui.wallet) {

            updateWalletUI(
                ui.wallet
            );

            return;

        }


        /* =================================
           OPEN WALLET SELECTOR
        ================================= */

        console.log(
            "CHUBBYX: Opening wallet selector..."
        );


        await ui.openModal();


    } catch (error) {

        console.error(
            "CHUBBYX open wallet error:",
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
            "CHUBBYX disconnect error:",
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
            "wallet-status"
        );

    const connectBtn =
        document.getElementById(
            "connect-wallet-btn"
        );

    const disconnectBtn =
        document.getElementById(
            "disconnect-wallet-btn"
        );

    const message =
        document.getElementById(
            "wallet-message"
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
        "CHUBBYX: Going back to Home..."
    );


    /* Close wallet selector if open */

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


    /* =====================================
       RETURN TO HOME
    ===================================== */

    if (
        typeof window.switchPage ===
        "function"
    ) {

        window.switchPage(
            "home"
        );

        return;

    }


    /* =====================================
       FALLBACK
       If switchPage isn't global
    ===================================== */

    const walletPageElement =
        document.getElementById(
            "wallet-page"
        );

    const homePageElement =
        document.getElementById(
            "home-page"
        );


    if (walletPageElement) {

        walletPageElement.style.display =
            "none";

    }


    if (homePageElement) {

        homePageElement.style.display =
            "block";

    }

}


/* =========================================
   MAKE FUNCTIONS GLOBAL
   IMPORTANT
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