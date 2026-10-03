/* =========================================================
   CHUBBYX — TON CONNECT WALLET
   FINAL STABLE VERSION
   ========================================================= */

let tonConnectUI = null;
let tonConnectStarting = null;
let walletPageLoaded = false;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

const TWA_RETURN_URL =
    "https://t.me/ChubbyX_Coin_bot/chubbyx";


/* =========================================================
   ELEMENTS
   ========================================================= */

function walletPage() {
    return document.getElementById("wallet-page");
}

function connectButton() {
    return document.getElementById("chubbyx-connect-button");
}

function disconnectButton() {
    return document.getElementById("chubbyx-disconnect-button");
}

function walletStatus() {
    return document.getElementById("chubbyx-wallet-status");
}

function walletMessage() {
    return document.getElementById("chubbyx-wallet-message");
}


/* =========================================================
   MESSAGE
   ========================================================= */

function setWalletMessage(message) {

    const el = walletMessage();

    if (el) {
        el.textContent = message;
    }

    console.log("[ChubbyX Wallet]", message);
}


/* =========================================================
   WALLET UI
   ========================================================= */

function createWalletUI() {

    const page = walletPage();

    if (!page) {
        console.error("ChubbyX: wallet-page not found");
        return;
    }

    if (walletPageLoaded) {
        return;
    }

    page.innerHTML = `
        <div
            style="
                width:100%;
                max-width:420px;
                min-height:100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                padding:25px 18px 120px;
                color:white;
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

                <button
                    id="chubbyx-wallet-back"
                    type="button"
                    aria-label="Back"
                    style="
                        border:none;
                        background:rgba(255,255,255,0.10);
                        color:white;
                        width:44px;
                        height:44px;
                        border-radius:50%;
                        font-size:25px;
                        line-height:44px;
                        padding:0;
                        cursor:pointer;
                        touch-action:manipulation;
                        pointer-events:auto;
                        -webkit-tap-highlight-color:transparent;
                    "
                >‹</button>


                <div
                    style="
                        font-size:24px;
                        font-weight:800;
                    "
                >
                    Wallet
                </div>


                <div style="width:44px;"></div>

            </div>


            <!-- CARD -->

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
                        background:linear-gradient(
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


                <div
                    style="
                        font-size:23px;
                        font-weight:800;
                        margin-bottom:8px;
                    "
                >
                    Connect your TON Wallet
                </div>


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
                        touch-action:manipulation;
                        pointer-events:auto;
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
                        touch-action:manipulation;
                        pointer-events:auto;
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
                        color:rgba(255,255,255,.55);
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
                    Preparing TON Wallet...
                </div>

            </div>

        </div>
    `;

    walletPageLoaded = true;


    /* =====================================================
       BACK BUTTON
       ===================================================== */

    const back = document.getElementById(
        "chubbyx-wallet-back"
    );

    if (back) {

        back.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopImmediatePropagation();

                console.log(
                    "ChubbyX: BACK clicked"
                );

                /*
                 * IMPORTANT:
                 * Back ONLY changes the page.
                 * It NEVER calls TON Connect.
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

            },
            true
        );
    }


    /* =====================================================
       CONNECT BUTTON
       ===================================================== */

    const connect = connectButton();

    if (connect) {

        connect.addEventListener(
            "click",
            async function(event) {

                event.preventDefault();
                event.stopImmediatePropagation();

                console.log(
                    "ChubbyX: CONNECT clicked"
                );

                await openWallet();

            },
            true
        );
    }


    /* =====================================================
       DISCONNECT BUTTON
       ===================================================== */

    const disconnect = disconnectButton();

    if (disconnect) {

        disconnect.addEventListener(
            "click",
            async function(event) {

                event.preventDefault();
                event.stopImmediatePropagation();

                console.log(
                    "ChubbyX: DISCONNECT clicked"
                );

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

                    updateWalletUI(null);

                } catch (error) {

                    console.error(
                        "ChubbyX disconnect error:",
                        error
                    );

                    setWalletMessage(
                        "Could not disconnect wallet."
                    );

                }

            },
            true
        );
    }
}


/* =========================================================
   WAIT FOR SDK
   ========================================================= */

function waitForTonConnectSDK() {

    return new Promise(function(resolve, reject) {

        let attempts = 0;

        const timer = setInterval(function() {

            attempts++;

            if (
                window.TON_CONNECT_UI &&
                window.TON_CONNECT_UI.TonConnectUI
            ) {

                clearInterval(timer);

                resolve();

                return;
            }

            if (attempts >= 80) {

                clearInterval(timer);

                reject(
                    new Error(
                        "TON Connect UI SDK not loaded"
                    )
                );
            }

        }, 250);

    });
}


/* =========================================================
   START TON CONNECT
   ========================================================= */

async function startTonConnect() {

    /*
     * Already ready
     */

    if (tonConnectUI) {
        return tonConnectUI;
    }


    /*
     * Already starting
     */

    if (tonConnectStarting) {
        return tonConnectStarting;
    }


    tonConnectStarting = (async function() {

        try {

            setWalletMessage(
                "Loading TON Connect..."
            );


            await waitForTonConnectSDK();


            console.log(
                "ChubbyX: TON Connect SDK ready"
            );


            tonConnectUI =
                new window.TON_CONNECT_UI.TonConnectUI({

                    manifestUrl:
                        MANIFEST_URL

                });


            /*
             * Telegram Mini App return URL
             */

            try {

                tonConnectUI.uiOptions = {

                    twaReturnUrl:
                        TWA_RETURN_URL

                };

            } catch (error) {

                console.warn(
                    "ChubbyX: twaReturnUrl warning",
                    error
                );

            }


            /*
             * Wallet status listener
             */

            tonConnectUI.onStatusChange(
                function(wallet) {

                    console.log(
                        "ChubbyX wallet status:",
                        wallet
                    );

                    updateWalletUI(wallet);

                }
            );


            /*
             * Restore previous connection
             */

            try {

                if (
                    tonConnectUI.connectionRestored
                ) {

                    await tonConnectUI
                        .connectionRestored;

                }

            } catch (error) {

                console.warn(
                    "ChubbyX connection restore warning:",
                    error
                );

            }


            updateWalletUI(
                tonConnectUI.wallet
            );


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
                "ChubbyX: TON Connect READY"
            );


            return tonConnectUI;

        } catch (error) {

            console.error(
                "ChubbyX TON initialization error:",
                error
            );

            tonConnectUI = null;

            setWalletMessage(
                "TON Connect failed. Please reload."
            );

            throw error;

        } finally {

            tonConnectStarting = null;

        }

    })();


    return tonConnectStarting;
}


/* =========================================================
   OPEN WALLET
   ========================================================= */

async function openWallet() {

    console.log(
        "ChubbyX: openWallet()"
    );


    try {

        /*
         * IMPORTANT:
         * If SDK isn't ready, WAIT for it.
         * We do NOT lose the first tap.
         */

        const ui =
            await startTonConnect();


        if (!ui) {

            setWalletMessage(
                "TON Connect is not available."
            );

            return;
        }


        /*
         * Already connected
         */

        if (
            ui.wallet &&
            ui.wallet.account
        ) {

            updateWalletUI(
                ui.wallet
            );

            return;
        }


        setWalletMessage(
            "Opening wallet list..."
        );


        /*
         * Official TON Connect modal
         */

        await ui.openModal();


    } catch (error) {

        console.error(
            "ChubbyX open wallet error:",
            error
        );

        setWalletMessage(
            "Wallet list could not be opened."
        );

    }

}


/* =========================================================
   UPDATE UI
   ========================================================= */

function updateWalletUI(wallet) {

    const status = walletStatus();
    const connect = connectButton();
    const disconnect = disconnectButton();

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


        if (address.length > 18) {

            shortAddress =
                address.substring(0, 8) +
                "..." +
                address.substring(
                    address.length - 8
                );

        }


        status.textContent =
            "Connected: " +
            shortAddress;


        status.style.color =
            "#4ade80";


        if (connect) {
            connect.style.display =
                "none";
        }


        if (disconnect) {
            disconnect.style.display =
                "block";
        }


        setWalletMessage(
            "TON Wallet connected successfully."
        );

    } else {

        status.textContent =
            "Wallet not connected";


        status.style.color =
            "rgba(255,255,255,.55)";


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


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "ChubbyX FINAL wallet.js loaded"
        );


        createWalletUI();


        /*
         * Start TON Connect immediately.
         * This fixes the first-click problem.
         */

        try {

            await startTonConnect();

        } catch (error) {

            console.error(
                "ChubbyX startup wallet error:",
                error
            );

        }

    }
);