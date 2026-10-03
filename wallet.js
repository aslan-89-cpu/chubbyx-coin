/* =========================================
   CHUBBYX — TON CONNECT WALLET
   TELEGRAM MINI APP VERSION
   FULL FIXED VERSION
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

function getWalletMessage() {
    return document.getElementById("chubbyx-wallet-message");
}

function setWalletMessage(message) {

    const el = getWalletMessage();

    if (el) {
        el.innerText = message;
    }

    console.log(
        "[ChubbyX Wallet]",
        message
    );
}


/* =========================================
   LOAD WALLET PAGE
   ========================================= */

function loadWalletUI() {

    const walletPage = getWalletPage();

    if (!walletPage) {

        console.error(
            "ChubbyX: wallet-page not found"
        );

        return;
    }


    /*
     * Make wallet page clickable.
     */

    walletPage.style.zIndex = "99999";
    walletPage.style.pointerEvents = "auto";
    walletPage.style.touchAction = "auto";


    /* =====================================
       CREATE UI ONLY ONCE
       ===================================== */

    if (!walletPageLoaded) {

        walletPage.innerHTML = `

            <div
                id="chubbyx-wallet-container"
                style="
                    width:100%;
                    max-width:420px;
                    min-height:100%;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    padding:25px 18px 120px;
                    color:white;
                    pointer-events:auto;
                "
            >

                <!-- HEADER -->

                <div
                    style="
                        width:100%;
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        margin-bottom:25px;
                    "
                >

                    <!-- BACK -->

                    <button
                        id="chubbyx-wallet-back"
                        type="button"
                        aria-label="Back"
                        style="
                            border:none;
                            outline:none;
                            background:rgba(255,255,255,0.10);
                            color:white;
                            width:42px;
                            height:42px;
                            border-radius:50%;
                            font-size:28px;
                            line-height:42px;
                            padding:0;
                            cursor:pointer;
                            pointer-events:auto;
                            touch-action:manipulation;
                            -webkit-tap-highlight-color:transparent;
                        "
                    >
                        ‹
                    </button>


                    <!-- TITLE -->

                    <div
                        style="
                            font-size:24px;
                            font-weight:800;
                        "
                    >
                        Wallet
                    </div>


                    <!-- EMPTY SPACE -->

                    <div
                        style="
                            width:42px;
                            height:42px;
                        "
                    ></div>

                </div>


                <!-- WALLET CARD -->

                <div
                    style="
                        width:100%;
                        background:rgba(255,255,255,0.08);
                        border:1px solid rgba(255,255,255,0.10);
                        border-radius:24px;
                        padding:28px 20px;
                        text-align:center;
                    "
                >

                    <!-- ICON -->

                    <div
                        style="
                            width:78px;
                            height:78px;
                            border-radius:22px;
                            margin:0 auto 18px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            background:
                                linear-gradient(
                                    135deg,
                                    #6c4cff,
                                    #a855f7
                                );
                            font-size:40px;
                            box-shadow:
                                0 10px 30px
                                rgba(100,70,255,.30);
                        "
                    >
                        💎
                    </div>


                    <!-- TITLE -->

                    <div
                        style="
                            font-size:23px;
                            font-weight:800;
                            margin-bottom:8px;
                        "
                    >
                        Connect your TON Wallet
                    </div>


                    <!-- DESCRIPTION -->

                    <div
                        style="
                            color:rgba(255,255,255,.65);
                            font-size:14px;
                            line-height:1.5;
                            margin-bottom:22px;
                        "
                    >
                        Connect your wallet to use ChubbyX features.
                    </div>


                    <!-- CONNECT BUTTON -->

                    <button
                        id="chubbyx-connect-button"
                        type="button"
                        style="
                            width:100%;
                            border:none;
                            outline:none;
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
                            pointer-events:auto;
                            touch-action:manipulation;
                            box-shadow:
                                0 8px 25px
                                rgba(108,76,255,.30);
                            -webkit-tap-highlight-color:transparent;
                        "
                    >
                        Connect Wallet
                    </button>


                    <!-- DISCONNECT BUTTON -->

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
                            pointer-events:auto;
                            touch-action:manipulation;
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

                    /*
                     * IMPORTANT:
                     * Stop only this button event.
                     *
                     * Back button has its own
                     * completely separate event.
                     */

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    console.log(
                        "CHUBBYX: CONNECT CLICK"
                    );


                    openChubbyXWallet();

                },
                false
            );

        }


        /* =================================
           DISCONNECT BUTTON
           ================================= */

        const disconnectButton =
            getDisconnectButton();


        if (disconnectButton) {

            disconnectButton.addEventListener(
                "click",
                async function(event) {

                    event.preventDefault();
                    event.stopImmediatePropagation();


                    if (!tonConnectUI) {
                        return;
                    }


                    try {

                        setWalletMessage(
                            "Disconnecting wallet..."
                        );


                        await tonConnectUI.disconnect();


                        updateWalletStatus(
                            null
                        );


                        setWalletMessage(
                            "Wallet disconnected."
                        );


                    } catch (error) {

                        console.error(
                            "CHUBBYX DISCONNECT ERROR:",
                            error
                        );


                        setWalletMessage(
                            "Could not disconnect wallet."
                        );

                    }

                },
                false
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
                    event.stopImmediatePropagation();


                    console.log(
                        "CHUBBYX: BACK CLICK"
                    );


                    /*
                     * VERY IMPORTANT:
                     *
                     * If TON Connect modal happens
                     * to be open, close ONLY the modal.
                     *
                     * Otherwise go Home.
                     */

                    if (
                        tonConnectUI &&
                        tonConnectUI.modalState &&
                        tonConnectUI.modalState.status ===
                        "opened"
                    ) {

                        try {

                            tonConnectUI.closeModal();

                        } catch (error) {

                            console.warn(
                                "CHUBBYX: modal close error",
                                error
                            );

                        }

                        return;
                    }


                    /*
                     * Normal Back:
                     * GO HOME ONLY.
                     */

                    if (
                        typeof window.switchPage ===
                        "function"
                    ) {

                        window.switchPage(
                            "home",
                            null
                        );

                    }

                },
                false
            );

        }

    }


    /*
     * Start TON Connect immediately.
     *
     * We DO NOT wait for the user to
     * press Connect.
     */

    initChubbyXWallet();

}


/* =========================================
   WAIT FOR TON CONNECT SDK
   ========================================= */

function waitForTonConnectSDK() {

    return new Promise(
        function(resolve, reject) {

            let attempts = 0;

            const maxAttempts = 100;

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
                    100
                );

        }
    );

}


/* =========================================
   INITIALIZE TON CONNECT
   ========================================= */

function initChubbyXWallet() {

    /*
     * Already created.
     */

    if (tonConnectUI) {

        return Promise.resolve(
            tonConnectUI
        );

    }


    /*
     * Already initializing.
     */

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
                 * Wait for SDK in background.
                 *
                 * This happens BEFORE the
                 * user needs to press Connect.
                 */

                await waitForTonConnectSDK();


                console.log(
                    "CHUBBYX: TON Connect SDK loaded"
                );


                /* =================================
                   CREATE TON CONNECT
                   ================================= */

                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL

                    });


                console.log(
                    "CHUBBYX: TON Connect object created"
                );


                /* =================================
                   TELEGRAM MINI APP RETURN URL
                   ================================= */

                try {

                    tonConnectUI.uiOptions = {

                        twaReturnUrl:
                            TWA_RETURN_URL

                    };


                    console.log(
                        "CHUBBYX: TWA return URL configured"
                    );

                } catch (error) {

                    console.warn(
                        "CHUBBYX: TWA return URL error:",
                        error
                    );

                }


                /* =================================
                   WALLET STATUS
                   ================================= */

                tonConnectUI.onStatusChange(
                    function(wallet) {

                        console.log(
                            "CHUBBYX: WALLET STATUS",
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
                                "CHUBBYX: MODAL STATE",
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


                /* =================================
                   RESTORE PREVIOUS CONNECTION
                   ================================= */

                try {

                    if (
                        tonConnectUI.connectionRestored
                    ) {

                        await tonConnectUI
                            .connectionRestored;

                    }

                } catch (error) {

                    console.warn(
                        "CHUBBYX: connection restore warning:",
                        error
                    );

                }


                /*
                 * Wallet UI is now ready.
                 */

                walletReady = true;


                updateWalletStatus(
                    tonConnectUI.wallet
                );


                /* =================================
                   PRELOAD WALLET LIST
                   ================================= */

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

                } catch (error) {

                    console.warn(
                        "CHUBBYX: wallet list preload warning:",
                        error
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
                    "CHUBBYX TON CONNECT READY"
                );


                return tonConnectUI;


            } catch (error) {

                console.error(
                    "CHUBBYX TON CONNECT INIT ERROR:",
                    error
                );


                walletReady = false;


                tonConnectUI = null;


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
        "CHUBBYX: OPEN WALLET"
    );


    /* =====================================
       ALREADY CONNECTED
       ===================================== */

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


    /* =====================================
       TON CONNECT NOT READY YET
       ===================================== */

    if (!tonConnectUI) {

        setWalletMessage(
            "TON Connect is loading..."
        );


        /*
         * IMPORTANT:
         *
         * Initialization already starts
         * when wallet page loads.
         *
         * If for some reason it is not
         * ready yet, we initialize here.
         */

        initChubbyXWallet()
            .then(
                function(ui) {

                    if (!ui) {

                        throw new Error(
                            "TON Connect UI unavailable"
                        );

                    }


                    setWalletMessage(
                        "Opening wallet list..."
                    );


                    /*
                     * Open immediately after
                     * initialization.
                     */

                    return ui.openModal();

                }
            )
            .catch(
                function(error) {

                    console.error(
                        "CHUBBYX OPEN ERROR:",
                        error
                    );


                    setWalletMessage(
                        "Wallet list could not be opened."
                    );

                }
            );


        return;

    }


    /* =====================================
       OPEN MODAL
       ===================================== */

    try {

        setWalletMessage(
            "Opening wallet list..."
        );


        console.log(
            "CHUBBYX: CALLING openModal()"
        );


        const modalPromise =
            tonConnectUI.openModal();


        if (
            modalPromise &&
            typeof modalPromise.catch ===
            "function"
        ) {

            modalPromise.catch(
                function(error) {

                    console.error(
                        "CHUBBYX openModal ERROR:",
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
            "CHUBBYX openModal EXCEPTION:",
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


    /* =====================================
       CONNECTED
       ===================================== */

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


        return;
    }


    /* =====================================
       NOT CONNECTED
       ===================================== */

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

        console.log(
            "CHUBBYX PAGE:",
            pageId
        );


        /*
         * IMPORTANT:
         *
         * Call original page switch first.
         */

        if (
            typeof originalSwitchPage ===
            "function"
        ) {

            originalSwitchPage(
                pageId,
                element
            );

        }


        /*
         * NO setTimeout HERE.
         *
         * Wallet UI is loaded immediately.
         */

        if (
            pageId ===
            "wallet"
        ) {

            loadWalletUI();

        }

    };


/* =========================================
   INITIALIZE ON PAGE LOAD
   ========================================= */

function initializeChubbyXWalletPage() {

    console.log(
        "CHUBBYX: wallet.js loaded"
    );


    /*
     * Create wallet page UI.
     */

    if (
        document.getElementById(
            "wallet-page"
        )
    ) {

        loadWalletUI();

    }

}


/* =========================================
   DOM READY
   ========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeChubbyXWalletPage
    );

} else {

    initializeChubbyXWalletPage();

}