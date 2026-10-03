/* =========================================
   CHUBBYX — TON CONNECT WALLET
   Telegram Mini App
   ========================================= */

let tonConnectUI = null;
let walletPageLoaded = false;
let walletOpening = false;
let tonConnectStarting = null;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

const TWA_RETURN_URL =
    "https://t.me/ChubbyX_Coin_bot/chubbyx";


/* =========================================
   LOAD WALLET PAGE
   ========================================= */

function loadWalletUI() {

    const walletPage =
        document.getElementById("wallet-page");

    if (!walletPage) return;


    walletPage.style.zIndex = "99999";
    walletPage.style.pointerEvents = "auto";
    walletPage.style.touchAction = "auto";


    if (!walletPageLoaded) {

        walletPage.innerHTML = `

            <h2 class="page-title">
                Connect Wallet
            </h2>

            <div style="
                width:100%;
                flex:1;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                text-align:center;
                touch-action:auto;
            ">

                <p id="wallet-status-text"
                    style="
                        color:#ccc;
                        margin-bottom:25px;
                        max-width:280px;
                        font-size:15px;
                    ">
                    Connect your TON wallet
                </p>

                <button
                    id="chubbyx-connect-button"
                    type="button"
                    style="
                        position:relative;
                        z-index:999999;

                        width:220px;
                        height:54px;

                        border:none;
                        border-radius:14px;

                        background:#0098ea;
                        color:white;

                        font-size:16px;
                        font-weight:bold;

                        cursor:pointer;
                        pointer-events:auto;
                        touch-action:manipulation;

                        -webkit-user-select:none;
                        user-select:none;

                        -webkit-tap-highlight-color:transparent;

                        box-shadow:
                        0 5px 18px
                        rgba(0,152,234,0.30);
                    ">
                    Connect Wallet
                </button>


                <div
                    id="wallet-details-box"
                    style="
                        display:none;
                        margin-top:25px;
                        background:rgba(255,255,255,0.06);
                        padding:15px;
                        border-radius:14px;
                        width:100%;
                        max-width:280px;
                    "
                >

                    <div style="
                        color:#eeb308;
                        font-weight:bold;
                        margin-bottom:7px;
                    ">
                        Connected Wallet
                    </div>

                    <div
                        id="wallet-address-string"
                        style="
                            color:white;
                            font-size:13px;
                            word-break:break-all;
                        "
                    ></div>

                    <button
                        id="chubbyx-disconnect-button"
                        type="button"
                        style="
                            margin-top:15px;
                            width:100%;
                            padding:10px;

                            border:none;
                            border-radius:10px;

                            background:#e74c3c;
                            color:white;

                            font-weight:bold;
                            cursor:pointer;
                            touch-action:manipulation;
                        "
                    >
                        Disconnect
                    </button>

                </div>


                <button
                    id="chubbyx-back-button"
                    type="button"
                    style="
                        margin-top:30px;

                        width:100%;
                        max-width:240px;

                        padding:12px;

                        border:1px solid
                        rgba(255,255,255,0.2);

                        border-radius:20px;

                        background:
                        rgba(255,255,255,0.1);

                        color:white;

                        font-size:14px;
                        font-weight:bold;

                        cursor:pointer;
                        touch-action:manipulation;
                    "
                >
                    ← Back to Home
                </button>

            </div>
        `;


        walletPageLoaded = true;


        /* CONNECT */

        const connectButton =
            document.getElementById(
                "chubbyx-connect-button"
            );

        if (connectButton) {

            connectButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    /*
                     * IMPORTANT:
                     * Do not put an await before openModal().
                     * This keeps the wallet opening directly
                     * inside the user's tap.
                     */

                    openChubbyXWallet();
                }
            );
        }


        /* DISCONNECT */

        const disconnectButton =
            document.getElementById(
                "chubbyx-disconnect-button"
            );

        if (disconnectButton) {

            disconnectButton.addEventListener(
                "click",
                async function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    await disconnectChubbyXWallet();
                }
            );
        }


        /* BACK */

        const backButton =
            document.getElementById(
                "chubbyx-back-button"
            );

        if (backButton) {

            backButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (
                        tonConnectUI &&
                        typeof tonConnectUI.closeModal ===
                        "function"
                    ) {

                        try {
                            tonConnectUI.closeModal();
                        } catch (error) {
                            console.log(
                                "TON modal already closed."
                            );
                        }
                    }

                    switchPage("home");
                }
            );
        }
    }


    startTonConnect();
}


/* =========================================
   START TON CONNECT
   ========================================= */

function startTonConnect() {

    /*
     * Prevent multiple initializations.
     */

    if (tonConnectStarting) {
        return tonConnectStarting;
    }


    tonConnectStarting =
        new Promise(async function(resolve) {

            try {

                /*
                 * Wait for SDK.
                 */

                let attempts = 0;

                while (
                    (
                        !window.TON_CONNECT_UI ||
                        !window.TON_CONNECT_UI.TonConnectUI
                    ) &&
                    attempts < 40
                ) {

                    await new Promise(
                        function(r) {
                            setTimeout(r, 250);
                        }
                    );

                    attempts++;
                }


                if (
                    !window.TON_CONNECT_UI ||
                    !window.TON_CONNECT_UI.TonConnectUI
                ) {

                    console.error(
                        "ChubbyX: TON Connect SDK not found."
                    );

                    setWalletMessage(
                        "Wallet system failed to load."
                    );

                    resolve(false);
                    return;
                }


                /*
                 * Already initialized.
                 */

                if (tonConnectUI) {

                    resolve(true);
                    return;
                }


                console.log(
                    "ChubbyX: Initializing TON Connect..."
                );


                /*
                 * CREATE TON CONNECT
                 */

                tonConnectUI =
                    new window.TON_CONNECT_UI.TonConnectUI({

                        manifestUrl:
                            MANIFEST_URL

                    });


                /*
                 * Telegram Mini App return URL.
                 *
                 * This is supported by TON Connect UI
                 * for TMA environments.
                 */

                tonConnectUI.uiOptions = {

                    twaReturnUrl:
                        TWA_RETURN_URL

                };


                /*
                 * STATUS CHANGE
                 */

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


                /*
                 * MODAL STATE
                 */

                if (
                    typeof tonConnectUI.onModalStateChange ===
                    "function"
                ) {

                    tonConnectUI.onModalStateChange(
                        function(state) {

                            console.log(
                                "ChubbyX modal:",
                                state
                            );
                        }
                    );
                }


                /*
                 * IMPORTANT:
                 *
                 * Wait until TON Connect has finished
                 * restoring any previous connection.
                 */

                if (
                    tonConnectUI.connectionRestored
                ) {

                    try {

                        const restored =
                            await tonConnectUI
                                .connectionRestored;

                        console.log(
                            "ChubbyX connection restored:",
                            restored
                        );

                    } catch (restoreError) {

                        console.warn(
                            "ChubbyX restore warning:",
                            restoreError
                        );
                    }
                }


                /*
                 * Get current wallet AFTER
                 * restoration has completed.
                 */

                updateWalletStatus(
                    tonConnectUI.wallet
                );


                console.log(
                    "ChubbyX: TON Connect ready."
                );


                resolve(true);


            } catch (error) {

                console.error(
                    "ChubbyX TON initialization error:",
                    error
                );


                tonConnectUI = null;

                setWalletMessage(
                    "Wallet initialization error."
                );

                resolve(false);
            }

        });


    return tonConnectStarting;
}


/* =========================================
   OPEN WALLET
   ========================================= */

async function openChubbyXWallet() {

    if (walletOpening) {
        return;
    }


    walletOpening = true;


    const button =
        document.getElementById(
            "chubbyx-connect-button"
        );


    try {

        /*
         * If SDK has not initialized yet,
         * initialize it.
         */

        if (!tonConnectUI) {

            setWalletMessage(
                "Loading wallet..."
            );

            await startTonConnect();
        }


        if (!tonConnectUI) {

            setWalletMessage(
                "Wallet is not ready."
            );

            return;
        }


        /*
         * Already connected.
         */

        if (
            tonConnectUI.wallet &&
            tonConnectUI.wallet.account &&
            tonConnectUI.wallet.account.address
        ) {

            updateWalletStatus(
                tonConnectUI.wallet
            );

            return;
        }


        if (button) {

            button.disabled = true;

            button.innerText =
                "Opening Wallet...";

            button.style.opacity =
                "0.7";
        }


        setWalletMessage(
            "Choose your TON wallet..."
        );


        console.log(
            "ChubbyX: Opening wallet list..."
        );


        /*
         * OPEN TON CONNECT MODAL
         */

        await tonConnectUI.openModal();


        console.log(
            "ChubbyX: Wallet list opened."
        );


    } catch (error) {

        console.error(
            "ChubbyX open wallet error:",
            error
        );


        setWalletMessage(
            "Could not open wallet."
        );


    } finally {

        walletOpening = false;


        if (button) {

            button.disabled = false;

            button.innerText =
                "Connect Wallet";

            button.style.opacity =
                "1";
        }
    }
}


/* =========================================
   UPDATE WALLET STATUS
   ========================================= */

function updateWalletStatus(wallet) {

    const status =
        document.getElementById(
            "wallet-status-text"
        );


    const box =
        document.getElementById(
            "wallet-details-box"
        );


    const addressElement =
        document.getElementById(
            "wallet-address-string"
        );


    /*
     * CONNECTED
     */

    if (
        wallet &&
        wallet.account &&
        wallet.account.address
    ) {

        const address =
            wallet.account.address;


        console.log(
            "================================"
        );

        console.log(
            "ChubbyX CONNECTED:"
        );

        console.log(
            address
        );

        console.log(
            "================================"
        );


        if (status) {

            status.innerText =
                "Wallet connected successfully!";
        }


        if (box) {

            box.style.display =
                "block";
        }


        if (addressElement) {

            addressElement.innerText =
                shortenAddress(address);
        }


        localStorage.setItem(
            "user_wallet",
            address
        );


    } else {

        console.log(
            "ChubbyX: Wallet not connected."
        );


        if (status) {

            status.innerText =
                "Connect your TON wallet";
        }


        if (box) {

            box.style.display =
                "none";
        }


        if (addressElement) {

            addressElement.innerText =
                "";
        }


        localStorage.removeItem(
            "user_wallet"
        );
    }
}


/* =========================================
   DISCONNECT
   ========================================= */

async function disconnectChubbyXWallet() {

    if (!tonConnectUI) {
        return;
    }


    try {

        await tonConnectUI.disconnect();


        localStorage.removeItem(
            "user_wallet"
        );


        updateWalletStatus(null);


        setWalletMessage(
            "Wallet disconnected."
        );


    } catch (error) {

        console.error(
            "ChubbyX disconnect error:",
            error
        );

        setWalletMessage(
            "Disconnect failed."
        );
    }
}


/* =========================================
   SHORT ADDRESS
   ========================================= */

function shortenAddress(address) {

    if (!address) {
        return "";
    }


    if (address.length <= 14) {
        return address;
    }


    return (
        address.substring(0, 7) +
        "..." +
        address.substring(
            address.length - 7
        )
    );
}


/* =========================================
   MESSAGE
   ========================================= */

function setWalletMessage(message) {

    const status =
        document.getElementById(
            "wallet-status-text"
        );


    if (status) {

        status.innerText =
            message;
    }
}


/* =========================================
   PAGE SWITCH HOOK
   ========================================= */

const originalSwitchPage =
    window.switchPage;


window.switchPage =
    function(pageId, element) {

        if (
            typeof originalSwitchPage ===
            "function"
        ) {

            originalSwitchPage(
                pageId,
                element
            );
        }


        if (pageId === "wallet") {

            setTimeout(
                function() {

                    loadWalletUI();

                },
                100
            );
        }
    };


/* =========================================
   DOM READY
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "wallet-page"
            )
        ) {

            loadWalletUI();
        }
    }
);