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

                <div
                    id="chubbyx-ton-connect"
                    style="
                        min-width:220px;
                        min-height:50px;
                        display:flex;
                        justify-content:center;
                        align-items:center;
                    "
                ></div>

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


function startTonConnect() {

    const connectRoot =
        document.getElementById("chubbyx-ton-connect");

    if (!connectRoot) return;


    if (
        !window.TON_CONNECT_UI ||
        !window.TON_CONNECT_UI.TonConnectUI
    ) {

        setWalletMessage("Loading wallet...");

        setTimeout(startTonConnect, 500);

        return;
    }


    if (tonConnectUI) {

        updateWalletStatus(tonConnectUI.wallet);

        return;
    }


    try {

        tonConnectUI =
            new window.TON_CONNECT_UI.TonConnectUI({

                manifestUrl:
                    MANIFEST_URL,

                buttonRootId:
                    "chubbyx-ton-connect",

                uiOptions: {
                    twaReturnUrl:
                        TWA_RETURN_URL
                }

            });


        tonConnectUI.onStatusChange(
            function(wallet) {
                updateWalletStatus(wallet);
            }
        );


        updateWalletStatus(
            tonConnectUI.wallet
        );


        /*
         * TEST:
         * If the TON Connect button itself
         * does not receive the click,
         * this invisible click layer gives
         * us a direct way to open the modal.
         */

        setTimeout(function() {

            const root =
                document.getElementById(
                    "chubbyx-ton-connect"
                );

            if (!root) return;


            root.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (tonConnectUI) {

                        tonConnectUI.openModal();

                    }

                },
                true
            );

        }, 500);


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
                shortenAddress(address);

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


function setWalletMessage(message) {

    const status =
        document.getElementById(
            "wallet-status-text"
        );

    if (status) {
        status.innerText = message;
    }
}


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