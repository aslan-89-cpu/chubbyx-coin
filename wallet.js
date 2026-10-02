// ================================
// ChubbyX — TON Wallet Connect
// ================================

let tonConnectUI = null;
let walletUIStarted = false;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

function loadWalletUI() {
    const walletPage = document.getElementById("wallet-page");

    if (!walletPage) return;

    walletPage.innerHTML = `
        <h2 class="page-title">Connect Wallet</h2>

        <div class="page-content"
             style="
                text-align:center;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                width:100%;
             ">

            <p id="wallet-status-text"
               style="
                    color:#ccc;
                    margin-bottom:30px;
                    max-width:280px;
                    font-size:15px;
                    line-height:1.4;
               ">
                Connect your TON wallet to participate in the future airdrop distribution.
            </p>

            <div id="ton-connect-button"
                 style="
                    margin-bottom:20px;
                    min-height:50px;
                 ">
            </div>

            <div id="wallet-details-box"
                 style="
                    display:none;
                    background:rgba(255,255,255,0.05);
                    padding:15px;
                    border-radius:12px;
                    width:100%;
                    max-width:280px;
                    margin-top:20px;
                    text-align:left;
                 ">

                <span style="
                    color:#eeb308;
                    font-weight:bold;
                    display:block;
                    margin-bottom:6px;
                ">
                    Connected Address
                </span>

                <span id="wallet-address-string"
                      style="
                        color:#fff;
                        font-size:13px;
                        word-break:break-all;
                      ">
                </span>
            </div>

            <button
                class="btn-top"
                onclick="switchPage('home')"
                style="
                    width:100%;
                    max-width:240px;
                    margin-top:30px;
                    padding:12px;
                ">
                Back to Home
            </button>
        </div>
    `;

    startTonConnect();
}


function startTonConnect() {

    if (walletUIStarted && tonConnectUI) {
        updateWalletUI();
        return;
    }

    if (!window.TON_CONNECT_UI) {
        console.error("TonConnect UI SDK was not found.");
        setWalletError("Wallet system is still loading...");
        return;
    }

    try {

        tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: MANIFEST_URL,
            buttonRootId: "ton-connect-button"
        });

        walletUIStarted = true;

        tonConnectUI.onStatusChange(function(wallet) {

            const statusLabel =
                document.getElementById("wallet-status-text");

            const detailsBox =
                document.getElementById("wallet-details-box");

            const addressString =
                document.getElementById("wallet-address-string");


            if (wallet && wallet.account) {

                const address = wallet.account.address;

                if (statusLabel) {
                    statusLabel.innerText =
                        "Your TON wallet is successfully connected!";
                }

                if (detailsBox && addressString) {

                    detailsBox.style.display = "block";

                    addressString.innerText =
                        shortenAddress(address);
                }

                localStorage.setItem(
                    "user_wallet",
                    address
                );

                if (
                    typeof window.saveWalletToFirebase === "function"
                ) {
                    window.saveWalletToFirebase(address);
                }

            } else {

                if (statusLabel) {
                    statusLabel.innerText =
                        "Connect your TON wallet to participate in the future airdrop distribution.";
                }

                if (detailsBox) {
                    detailsBox.style.display = "none";
                }

                localStorage.removeItem("user_wallet");
            }

        });

        updateWalletUI();

    } catch (error) {

        console.error(
            "TonConnect initialization error:",
            error
        );

        setWalletError(
            "Unable to initialize wallet connection."
        );
    }
}


function updateWalletUI() {

    if (!tonConnectUI) return;

    const wallet =
        tonConnectUI.wallet;

    if (wallet && wallet.account) {

        const address =
            wallet.account.address;

        const statusLabel =
            document.getElementById("wallet-status-text");

        const detailsBox =
            document.getElementById("wallet-details-box");

        const addressString =
            document.getElementById("wallet-address-string");


        if (statusLabel) {
            statusLabel.innerText =
                "Your TON wallet is successfully connected!";
        }

        if (detailsBox && addressString) {

            detailsBox.style.display = "block";

            addressString.innerText =
                shortenAddress(address);
        }

        localStorage.setItem(
            "user_wallet",
            address
        );

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
        address.substring(address.length - 7)
    );
}


function setWalletError(message) {

    const statusLabel =
        document.getElementById("wallet-status-text");

    if (statusLabel) {
        statusLabel.innerText = message;
    }
}


// =====================================
// Keep wallet page working with router
// =====================================

const originalSwitchPage =
    window.switchPage;

window.switchPage =
    function(pageId, element) {

        if (typeof originalSwitchPage === "function") {
            originalSwitchPage(pageId, element);
        }

        if (pageId === "wallet") {

            setTimeout(function() {
                loadWalletUI();
            }, 50);

        }
    };


// =====================================
// Initial load
// =====================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        function() {

            if (
                document.getElementById("wallet-page")
            ) {
                loadWalletUI();
            }

        }
    );

} else {

    if (
        document.getElementById("wallet-page")
    ) {
        loadWalletUI();
    }
}
