/* =========================================
   CHUBBYX — TON CONNECT WALLET
   TELEGRAM MINI APP VERSION
   ========================================= */

let tonConnectUI = null;
let walletPageLoaded = false;
let walletInitializing = false;
let walletReady = false;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

const TWA_RETURN_URL =
    "https://t.me/ChubbyX_Coin_bot/chubbyx";


/* =========================================
   HELPERS
   ========================================= */

function getWalletPage() {
    return document.getElementById("wallet-page");
}

function getConnectButton() {
    return document.getElementById("chubbyx-connect-button");
}

function getDisconnectButton() {
    return document.getElementById("chubbyx-disconnect-button");
}

function getWalletStatus() {
    return document.getElementById("chubbyx-wallet-status");
}

function setWalletMessage(message) {

    const el =
        document.getElementById(
            "chubbyx-wallet-message"
        );

    if (el) {
        el.innerText = message;
    }

    console.log(
        "[ChubbyX Wallet]",
        message
    );
}


/* =========================================
   WALLET UI
   ========================================= */

function loadWalletUI() {

    const walletPage =
        getWalletPage();

    if (!walletPage) {

        console.error(
            "ChubbyX: wallet-page not found"
        );

        return;
    }


    walletPage.style.zIndex = "99999";
    walletPage.style.pointerEvents = "auto";
    walletPage.style.touchAction = "auto";


    if (!walletPageLoaded) {

        walletPage.innerHTML = `

            <div style="
                width:100%;
                max-width:420px;
                min-height:100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                padding:25px 18px 120px;
                color:white;
            ">

                <!-- HEADER -->

                <div style="
                    width:100%;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    margin-bottom:25px;
                ">

                    <button
                        id="chubbyx-wallet-back"
                        type="button"
                        style="
                            border:none;
                            background:rgba(255,255,255,0.10);
                            color:white;
                            width:42px;
                            height:42px;
                            border-radius:50%;
                            font-size:20px;
                            cursor:pointer;
                            -webkit-tap-highlight-color:transparent;
                        "
                    >
                        ‹
                    </button>


                    <div style="
                        font-size:24px;
                        font-weight:800;
                    ">
                        Wallet
                    </div>


                    <div style="
                        width:42px;
                    "></div>

                </div>


                <!-- WALLET CARD -->

                <div style="
                    width:100%;
                    background:rgba(255,255,255,0.08);
                    border:1px solid rgba(255,255,255,0.10);
                    border-radius:24px;
                    padding:28px 20px;
                    text-align:center;
                ">


                    <!-- ICON -->

                    <div style="
                        width:78px;
                        height:78px;
                        border-radius:22px;
                        margin:0 auto 18px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:linear-gradient(
                            135deg,
                            #6c4cff,
                            #a855f7
                        );
                        font-size:40px;
                        box-shadow:
                            0 10px 30px
                            rgba(100,70,255,.30);
                    ">
                        💎
                    </div>


                    <div style="
                        font-size:23px;
                        font-weight:800;
                        margin-bottom:8px;
                    ">
                        Connect your TON Wallet
                    </div>


                    <div style="
                        color:rgba(255,255,255,.65);
                        font-size:14px;
                        line-height:1.5;
                        margin-bottom:22px;
                    ">
                        Connect your wallet to use ChubbyX features.
                    </div>


                    <!-- CONNECT -->

                    <button
                        id="chubbyx-connect-button"
                        type="button"
                        style="
                            width:100%;
                            border:none;
                            border-radius:16px;
                            padding:16px;
                            font-size:16px;
                            font-weight:800;
                            color:white;
                            background:
                                linear-gradient(
                                    135deg,
                                    #6c4cff,
                                    #8b5cf6
                                );
                            cursor:pointer;
                            box-shadow:
                                0 8px 25px
                                rgba(108,76,255,.30);
                            -webkit-tap-highlight-color:transparent;
                        "
                    >
                        Connect Wallet
                    </button>


                    <!-- DISCONNECT -->

                    <button
                        id="chubbyx-disconnect-button"
                        type="button"
                        style="
                            display:none;
                            width:100%;
                            border:
                                1px solid
                                rgba(255,255,255,.15);
                            border-radius:16px;
                            padding:14px;
                            margin-top:12px;
                            font-size:15px;
                            font-weight:700;
                            color:white;
                            background:
                                rgba(255,255,255,.06);
                            cursor:pointer;
                            -webkit-tap-highlight-color:transparent;
                        "
                    >
                        Disconnect
                    </button>


                    <!-- STATUS -->

                    <div
                        id="chubbyx-wallet-status"
                        style="
                            margin-top:18px;
                            font-size:13px;
                            color:
                                rgba(255,255,255,.55);
                            word-break:break-word;
                        "
                    >
                        Wallet not connected
                    </div>


                    <!-- MESSAGE -->

                    <div
                        id="chubbyx-wallet-message"
                        style="
                            margin-top:10px;
                            font-size:13px;
                            color:#aaa;
                            line-height:1.5;
                            word-break:break-word;
                        "
                    >
                        Preparing wallet...
                    </div>

                </div>

            </div>
        `;


        walletPageLoaded = true;


        /* =================================
           CONNECT BUTTON
           ================================= */

        const connectButton =
            getConnectButton();


        if (connectButton) {

            connectButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    openChubbyXWallet();

                }
            );

        }


        /* =================================
           DISCONNECT
           ================================= */

        const disconnectButton =
            getDisconnectButton();


        if (disconnectButton) {

            disconnectButton.addEventListener(
                "click",
                async function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (!tonConnectUI) {
                        return;
                    }

                    try {

                        setWalletMessage(
                            "Disconnecting wallet..."
                        );

                        await tonConnectUI.disconnect();

                        setWalletMessage(
                            "Wallet disconnected."
                        );

                        updateWalletStatus(
                            null
                        );

                    } catch (error) {

                        console.error(
                            "ChubbyX disconnect error:",
                            error
                        );

                        setWalletMessage(
                            "Could not disconnect wallet."
                        );

                    }

                }
            );

        }


        /* =================================
           BACK BUTTON
           ================================= */

        const backButton =
            document.getElementById(
                "chubbyx-wallet-back"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (
                        typeof window.switchPage ===
                        "function"
                    ) {

                        window.switchPage(
                            "home",
                            null
                        );

                    }

                }
            );

        }

    }


    /*
     * Start TON Connect in background.
     */

    startTonConnect();

}


/* =========================================
   WAIT FOR TON CONNECT SDK
   ========================================= */

function waitForTonConnectSDK() {

    return new Promise(
        function(resolve, reject) {

            let attempts = 0;

            const maxAttempts = 80;


            const timer =
                setInterval(
                    function() {

                        attempts++;


                        if (
                            window.TON_CONNECT_UI &&
                            window.TON_CONNECT_UI.TonConnectUI
                        ) {

                            clearInterval(timer);

                            resolve();

                            return;

                        }


                        if (
                            attempts >=
                            maxAttempts
                        ) {

                            clearInterval(timer);

                            reject(
                                new Error(
                                    "TON Connect UI SDK not loaded"
                                )
                            );

                        }

                    },
                    250
                );

        }
    );

}


/* =========================================
   START TON CONNECT
   ========================================= */

async function startTonConnect() {

    /* Already ready */

    if (tonConnectUI) {

        walletReady = true;

        updateWalletStatus(
            tonConnectUI.wallet
        );

        return tonConnectUI;

    }


    /* Already initializing */

    if (walletInitializing) {

        return walletInitializing;

    }


    walletInitializing =
        (async function() {

            try {

                setWalletMessage(
                    "Loading TON Connect..."
                );


                /*
                 * Wait for SDK
                 */

                await waitForTonConnectSDK();


                console.log(
                    "ChubbyX: TON Connect SDK loaded"
                );


                /*
                 * Create TON Connect
                 */

                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL

                    });


                /*
                 * IMPORTANT FOR
                 * TELEGRAM MINI APP
                 *
                 * This tells TON Connect
                 * where to return in TMA mode.
                 */

                try {

                    tonConnectUI.uiOptions = {

                        twaReturnUrl:
                            TWA_RETURN_URL

                    };

                    console.log(
                        "ChubbyX: TWA return URL configured"
                    );

                } catch (uiError) {

                    console.warn(
                        "ChubbyX: could not set TWA return URL:",
                        uiError
                    );

                }


                /* =================================
                   WALLET STATUS
                   ================================= */

                tonConnectUI.onStatusChange(
                    function(wallet) {

                        console.log(
                            "ChubbyX wallet status:",
                            wallet
                        );

                        updateWalletStatus(
                            wallet
                        );

                    }
                );


                /* =================================
                   MODAL STATE
                   ================================= */

                if (
                    typeof tonConnectUI
                        .onModalStateChange ===
                    "function"
                ) {

                    tonConnectUI.onModalStateChange(
                        function(state) {

                            console.log(
                                "ChubbyX modal state:",
                                state
                            );

                            if (
                                state &&
                                state.status ===
                                "opened"
                            ) {

                                setWalletMessage(
                                    "Choose your TON wallet."
                                );

                            }

                        }
                    );

                }


                /*
                 * IMPORTANT:
                 *
                 * Restore connection FIRST.
                 */

                try {

                    if (
                        tonConnectUI.connectionRestored
                    ) {

                        await tonConnectUI
                            .connectionRestored;

                    }

                } catch (restoreError) {

                    console.warn(
                        "ChubbyX restore warning:",
                        restoreError
                    );

                }


                /*
                 * Now mark ready.
                 */

                walletReady = true;


                updateWalletStatus(
                    tonConnectUI.wallet
                );


                /*
                 * Get wallet list only
                 * for diagnostics.
                 *
                 * We DO NOT open it here.
                 */

                try {

                    const wallets =
                        await tonConnectUI.getWallets();

                    console.log(
                        "CHUBBYX AVAILABLE WALLETS:",
                        wallets
                    );

                    console.log(
                        "CHUBBYX WALLET COUNT:",
                        wallets.length
                    );

                } catch (walletError) {

                    console.warn(
                        "ChubbyX wallet list warning:",
                        walletError
                    );

                }


                if (
                    tonConnectUI.wallet &&
                    tonConnectUI.wallet.account
                ) {

                    setWalletMessage(
                        "TON Wallet connected successfully."
                    );

                } else {

                    setWalletMessage(
                        "Choose your TON wallet."
                    );

                }


                console.log(
                    "ChubbyX TON Connect READY"
                );


                return tonConnectUI;


            } catch (error) {

                console.error(
                    "ChubbyX TON Connect initialization error:",
                    error
                );


                walletReady = false;


                setWalletMessage(
                    "TON Wallet loading failed. Please reload ChubbyX."
                );


                throw error;


            } finally {

                walletInitializing = false;

            }

        })();


    return walletInitializing;

}


/* =========================================
   OPEN WALLET
   ========================================= */

function openChubbyXWallet() {

    console.log(
        "ChubbyX: Connect Wallet clicked"
    );


    /*
     * If already connected,
     * don't open wallet picker.
     */

    if (
        tonConnectUI &&
        tonConnectUI.wallet &&
        tonConnectUI.wallet.account
    ) {

        updateWalletStatus(
            tonConnectUI.wallet
        );

        return;

    }


    /*
     * TON Connect must already exist.
     *
     * We don't await here because
     * this function is called directly
     * from the user's tap.
     */

    if (!tonConnectUI) {

        setWalletMessage(
            "TON Connect is still loading. Please tap again."
        );


        startTonConnect().catch(
            function(error) {

                console.error(
                    "ChubbyX wallet initialization error:",
                    error
                );

            }
        );

        return;

    }


    try {

        setWalletMessage(
            "Opening wallet list..."
        );


        /*
         * IMPORTANT:
         *
         * openModal() opens the official
         * TON Connect wallet picker.
         *
         * User selects:
         * OKX / Tonkeeper / Telegram Wallet /
         * Trust / Phantom / other supported wallets
         *
         * Then TON Connect opens the selected
         * wallet using its supported link/transport.
         */

        const result =
            tonConnectUI.openModal();


        if (
            result &&
            typeof result.catch ===
            "function"
        ) {

            result.catch(
                function(error) {

                    console.error(
                        "ChubbyX openModal error:",
                        error
                    );


                    setWalletMessage(
                        "Wallet list could not be opened."
                    );

                }
            );

        }

    } catch (error) {

        console.error(
            "ChubbyX open wallet error:",
            error
        );


        setWalletMessage(
            "Wallet opening failed."
        );

    }

}


/* =========================================
   UPDATE WALLET STATUS
   ========================================= */

function updateWalletStatus(wallet) {

    const status =
        getWalletStatus();

    const connectButton =
        getConnectButton();

    const disconnectButton =
        getDisconnectButton();


    if (!status) {
        return;
    }


    if (
        wallet &&
        wallet.account
    ) {

        const address =
            wallet.account.address || "";


        let shortAddress =
            address;


        if (
            address.length > 18
        ) {

            shortAddress =
                address.substring(
                    0,
                    8
                ) +
                "..." +
                address.substring(
                    address.length - 8
                );

        }


        status.innerText =
            "Connected: " +
            shortAddress;


        status.style.color =
            "#4ade80";


        if (connectButton) {

            connectButton.style.display =
                "none";

        }


        if (disconnectButton) {

            disconnectButton.style.display =
                "block";

        }


        setWalletMessage(
            "TON Wallet connected successfully."
        );


    } else {

        status.innerText =
            "Wallet not connected";


        status.style.color =
            "rgba(255,255,255,.55)";


        if (connectButton) {

            connectButton.style.display =
                "block";

        }


        if (disconnectButton) {

            disconnectButton.style.display =
                "none";

        }


        if (walletReady) {

            setWalletMessage(
                "Choose your TON wallet."
            );

        }

    }

}


/* =========================================
   PAGE SWITCH
   ========================================= */

const originalSwitchPage =
    window.switchPage;


window.switchPage =
    function(
        pageId,
        element
    ) {

        if (
            typeof originalSwitchPage ===
            "function"
        ) {

            originalSwitchPage(
                pageId,
                element
            );

        }


        if (
            pageId ===
            "wallet"
        ) {

            setTimeout(
                function() {

                    loadWalletUI();

                },
                50
            );

        }

    };


/* =========================================
   INITIALIZE
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "ChubbyX wallet.js loaded"
        );


        /*
         * Create wallet UI
         */

        if (
            document.getElementById(
                "wallet-page"
            )
        ) {

            loadWalletUI();

        }

    }
);