let tonConnectUI = null;
let walletPageLoaded = false;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";


/* ==============================
   WALLET PAGE
   ============================== */

function loadWalletUI() {

    const walletPage =
        document.getElementById("wallet-page");

    if (!walletPage) return;


    if (!walletPageLoaded) {

        walletPage.innerHTML = `

            <h2 class="page-title">
                Connect Wallet
            </h2>

            <div class="page-content"
                style="
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    text-align:center;
                    width:100%;
                "
            >

                <p id="wallet-status-text"
                    style="
                        color:#ccc;
                        margin-bottom:25px;
                        max-width:280px;
                        font-size:15px;
                    "
                >
                    Connect your TON wallet
                </p>


                <!-- OUR OWN CONNECT BUTTON -->

                <button
                    id="chubbyx-connect-wallet"
                    type="button"
                    style="
                        min-width:220px;
                        padding:14px 24px;
                        border:0;
                        border-radius:25px;
                        background:#eeb308;
                        color:#111;
                        font-size:16px;
                        font-weight:bold;
                        cursor:pointer;
                        -webkit-tap-highlight-color:transparent;
                    "
                >
                    Connect Wallet
                </button>


                <!-- WALLET DETAILS -->

                <div id="wallet-details-box"
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

                    <div id="wallet-address-string"
                        style="
                            color:white;
                            font-size:13px;
                            word-break:break-all;
                        "
                    ></div>

                </div>


                <!-- BACK BUTTON -->

                <button
                    type="button"
                    onclick="switchPage('home')"
                    style="
                        margin-top:30px;
                        width:100%;
                        max-width:240px;
                        padding:12px;
                        border:1px solid rgba(255,255,255,0.2);
                        border-radius:20px;
                        background:rgba(255,255,255,0.1);
                        color:white;
                        font-size:14px;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    ← Back to Home
                </button>

            </div>
        `;

        walletPageLoaded = true;
    }


    startTonConnect();
}


/* ==============================
   TON CONNECT
   ============================== */

function startTonConnect() {

    if (tonConnectUI) {

        updateWalletStatus(
            tonConnectUI.wallet
        );

        setupConnectButton();

        return;
    }


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


    try {

        tonConnectUI =
            new window.TON_CONNECT_UI.TonConnectUI({

                manifestUrl:
                    MANIFEST_URL

            });


        tonConnectUI.onStatusChange(
            function(wallet) {

                updateWalletStatus(wallet);

            }
        );


        updateWalletStatus(
            tonConnectUI.wallet
        );


        setupConnectButton();


    } catch (error) {

        console.error(
            "TON Connect error:",
            error
        );

        setWalletMessage(
            "Wallet connection error."
        );
    }
}


/* ==============================
   OUR CONNECT BUTTON
   ============================== */

function setupConnectButton() {

    const button =
        document.getElementById(
            "chubbyx-connect-wallet"
        );

    if (!button) return;


    button.onclick = async function(event) {

        event.preventDefault();
        event.stopPropagation();


        if (!tonConnectUI) {

            setWalletMessage(
                "Wallet is loading..."
            );

            startTonConnect();

            return;
        }


        try {

            console.log(
                "Opening TON Connect modal..."
            );


            await tonConnectUI.openModal();


        } catch (error) {

            console.error(
                "Open wallet error:",
                error
            );

            setWalletMessage(
                "Could not open wallet."
            );
        }

    };
}


/* ==============================
   WALLET STATUS
   ============================== */

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

    const connectButton =
        document.getElementById(
            "chubbyx-connect-wallet"
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
                shortenAddress(address);

        }


        if (connectButton) {

            connectButton.innerText =
                "Wallet Connected";

            connectButton.style.background =
                "#27ae60";

            connectButton.style.color =
                "white";

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


        if (connectButton) {

            connectButton.innerText =
                "Connect Wallet";

            connectButton.style.background =
                "#eeb308";

            connectButton.style.color =
                "#111";

        }

    }
}


/* ==============================
   SHORT ADDRESS
   ============================== */

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


/* ==============================
   MESSAGE
   ============================== */

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


/* ==============================
   PAGE SWITCH
   ============================== */

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


/* ==============================
   FIRST LOAD
   ============================== */

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