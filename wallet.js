/* =========================================
   CHUBBYX — WALLET.JS
========================================= */

let tonConnectUI = null;
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

    const page =
        document.getElementById("wallet-page");

    if (!page) {
        console.error("wallet-page not found");
        return;
    }


    /* Build Wallet page */

    page.innerHTML = `

        <div class="wallet-inner">

            <!-- TOP BACK -->

            <button
                id="wallet-back-top"
                type="button"
                class="wallet-back-top"
            >
                &gt;
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


    /* Add CSS */

    addWalletStyles();


    /* Buttons */

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

        connectBtn.onclick =
            openWallet;

    }


    /* DISCONNECT */

    if (disconnectBtn) {

        disconnectBtn.onclick =
            disconnectWallet;

    }


    /* TOP BACK > */

    if (backTop) {

        backTop.onclick =
            goHome;

    }


    /* BOTTOM BACK HOME */

    if (backHome) {

        backHome.onclick =
            goHome;

    }


    /* Update current wallet */

    updateWalletUI(
        tonConnectUI
            ? tonConnectUI.wallet
            : null
    );


    /* Start TON Connect */

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


    style.innerHTML = `

        .wallet-inner {

            position: relative;

            width: 100%;
            height: 100%;

            min-height: 100%;

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

            font-size: 30px;
            font-weight: bold;

            display: flex;

            align-items: center;
            justify-content: center;

            cursor: pointer;

            z-index: 9999;

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

            margin-top: 35px;

            padding: 25px 20px;

            border-radius: 20px;

            background:
                rgba(255,255,255,0.07);

            backdrop-filter:
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

            resolve();

            return;

        }


        const timer =
            setInterval(() => {

                if (
                    window.TON_CONNECT_UI &&
                    window.TON_CONNECT_UI.TonConnectUI
                ) {

                    clearInterval(timer);

                    resolve();

                }

            }, 100);

    });

}


/* =========================================
   START TON CONNECT
========================================= */

async function startTonConnect() {

    await waitForTonConnectSDK();


    if (tonConnectUI) {

        updateWalletUI(
            tonConnectUI.wallet
        );

        return tonConnectUI;

    }


    tonConnectUI =
        new window.TON_CONNECT_UI.TonConnectUI({

            manifestUrl:
                MANIFEST_URL

        });


    tonConnectUI.uiOptions = {

        twaReturnUrl:
            TWA_RETURN_URL

    };


    tonConnectUI.onStatusChange(
        (wallet) => {

            updateWalletUI(
                wallet
            );

        }
    );


    try {

        await tonConnectUI.connectionRestored;

    } catch (error) {

        console.log(
            "Connection restore:",
            error
        );

    }


    updateWalletUI(
        tonConnectUI.wallet
    );


    return tonConnectUI;

}


/* =========================================
   CONNECT WALLET
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

        const ui =
            await startTonConnect();


        if (!ui) {

            return;

        }


        /* Already connected */

        if (ui.wallet) {

            updateWalletUI(
                ui.wallet
            );

            return;

        }


        /* ONLY HERE WALLET LIST OPENS */

        await ui.openModal();


    } catch (error) {

        console.error(
            "TON Connect:",
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

        if (tonConnectUI) {

            await tonConnectUI.disconnect();

        }

    } catch (error) {

        console.error(
            "Disconnect:",
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

        /*
         * Wallet connected
         */

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

        /*
         * Wallet not connected
         */

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


    /*
     * Close TON Connect modal
     * WITHOUT disconnecting wallet
     */

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
            "Close modal:",
            error
        );

    }


    walletOpening = false;


    /*
     * Go Home
     */

    if (
        typeof window.switchPage ===
        "function"
    ) {

        window.switchPage(
            "home",
            document.getElementById(
                "default-nav"
            )
        );

    }

}