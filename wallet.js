let tonConnectUI = null;
let walletPageLoaded = false;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

const TWA_RETURN_URL =
    "https://t.me/ChubbyX_Coin_bot/chubbyx";


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

            <div
                style="
                    width:100%;
                    flex:1;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    text-align:center;
                    touch-action:auto;
                "
            >

                <p
                    id="wallet-status-text"
                    style="
                        color:#ccc;
                        margin-bottom:25px;
                        max-width:280px;
                        font-size:15px;
                    "
                >
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
                    "
                >
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

                    <div
                        style="
                            color:#eeb308;
                            font-weight:bold;
                            margin-bottom:7px;
                        "
                    >
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


        const connectButton =
            document.getElementById(
                "chubbyx-connect-button"
            );


        if (connectButton) {

            connectButton.onclick =
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    openChubbyXWallet();
                };
        }


        const backButton =
            document.getElementById(
                "chubbyx-back-button"
            );


        if (backButton) {

            backButton.onclick =
                function() {

                    switchPage("home");
                };
        }
    }


    startTonConnect();
}


/* =========================
   START TON CONNECT
   ========================= */

function startTonConnect() {

    if (
        !window.TON_CONNECT_UI ||
        !window.TON_CONNECT_UI.TonConnectUI
    ) {

        setWalletMessage(
            "Loading wallet..."
        );

        setTimeout(
            startTonConnect,
            500
        );

        return;
    }


    if (tonConnectUI) {

        updateWalletStatus(
            tonConnectUI.wallet
        );

        return;
    }


    try {

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
            function(wallet) {

                updateWalletStatus(
                    wallet
                );
            }
        );


        if (
            tonConnectUI.onModalStateChange
        ) {

            tonConnectUI.onModalStateChange(
                function(state) {

                    console.log(
                        "ChubbyX TON modal:",
                        state
                    );
                }
            );
        }


        updateWalletStatus(
            tonConnectUI.wallet
        );


    } catch (error) {

        console.error(
            "TON Connect initialization error:",
            error
        );

        setWalletMessage(
            "Wallet connection error."
        );
    }
}


/* =========================
   OPEN WALLET MODAL
   ========================= */

async function openChubbyXWallet() {

    const button =
        document.getElementById(
            "chubbyx-connect-button"
        );


    if (!tonConnectUI) {

        setWalletMessage(
            "Loading wallet..."
        );

        startTonConnect();

        return;
    }


    if (button) {

        button.innerText =
            "Opening Wallet...";

        button.disabled = true;
    }


    try {

        console.log(
            "ChubbyX: opening TON wallet modal"
        );


        await tonConnectUI.openModal();


        console.log(
            "ChubbyX: TON modal opened"
        );


    } catch (error) {

        console.error(
            "ChubbyX TON modal error:",
            error
        );


        setWalletMessage(
            "Wallet picker error."
        );

    } finally {

        if (button) {

            button.innerText =
                "Connect Wallet";

            button.disabled = false;
        }
    }
}


/* =========================
   WALLET STATUS
   ========================= */

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


    if (
        wallet &&
        wallet.account &&
        wallet.account.address
    ) {

        const address =
            wallet.account.address;


        if (status) {

            status.innerText =
                "Wallet connected successfully!";
        }


        if (box && addressElement) {

            box.style.display =
                "block";

            addressElement.innerText =
                shortenAddress(
                    address
                );
        }


        localStorage.setItem(
            "user_wallet",
            address
        );


    } else {

        if (status) {

            status.innerText =
                "Connect your TON wallet";
        }


        if (box) {

            box.style.display =
                "none";
        }
    }
}


/* =========================
   SHORT ADDRESS
   ========================= */

function shortenAddress(address) {

    if (!address) return "";

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


/* =========================
   MESSAGE
   ========================= */

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


/* =========================
   PAGE SWITCH
   ========================= */

const originalSwitchPage =
    window.switchPage;


window.switchPage =
    function(pageId, element) {

        originalSwitchPage(
            pageId,
            element
        );


        if (pageId === "wallet") {

            setTimeout(
                function() {

                    loadWalletUI();

                },
                100
            );
        }
    };


/* =========================
   PAGE LOAD
   ========================= */

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