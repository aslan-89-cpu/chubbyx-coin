
/* =========================================
   CHUBBYX — TON CONNECT WALLET
   FULL REPLACEMENT
   Preserves existing coin balances
========================================= */

(function () {
    "use strict";

    const MANIFEST_URL =
        "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

    const TWA_RETURN_URL =
        "https://t.me/ChubbyX_Coin_bot/chubbyx";

    let tonConnectUI = null;
    let tonConnectStarting = null;
    let walletPageLoaded = false;
    let walletModalOpening = false;
    let statusUnsubscribe = null;

    function getElement(id) {
        return document.getElementById(id);
    }

    function setMessage(message) {
        const status = getElement("wallet-status-text");
        if (status) status.textContent = message;
    }

    function shortenAddress(address) {
        if (!address) return "";

        if (address.length <= 14) return address;

        return address.slice(0, 7) +
            "..." +
            address.slice(-7);
    }

    function getAddress(wallet) {
        return wallet &&
            wallet.account &&
            wallet.account.address
            ? wallet.account.address
            : null;
    }

    function updateWalletStatus(wallet) {
        const status = getElement("wallet-status-text");
        const box = getElement("wallet-details-box");
        const addressElement = getElement("wallet-address-string");
        const connectButton = getElement("chubbyx-connect-button");

        const address = getAddress(wallet);

        if (address) {
            if (status) {
                status.textContent = "Wallet connected successfully!";
            }

            if (box) box.style.display = "block";

            if (addressElement) {
                addressElement.textContent = shortenAddress(address);
            }

            if (connectButton) {
                connectButton.textContent = "Wallet Connected";
            }

            try {
                localStorage.setItem("user_wallet", address);
            } catch (error) {
                console.warn("Could not save wallet display state.", error);
            }

            return;
        }

        if (status) {
            status.textContent = "Connect your TON wallet";
        }

        if (box) box.style.display = "none";

        if (addressElement) {
            addressElement.textContent = "";
        }

        if (connectButton) {
            connectButton.textContent = "Connect Wallet";
        }

        // Never modify chubby_coins here.
    }

    async function startTonConnect() {
        if (tonConnectUI) return tonConnectUI;

        if (tonConnectStarting) return tonConnectStarting;

        tonConnectStarting = (async function () {
            const library = window.TON_CONNECT_UI;

            if (!library || typeof library.TonConnectUI !== "function") {
                throw new Error(
                    "TON Connect SDK is unavailable. Check the SDK script in index.html."
                );
            }

            const ui = new library.TonConnectUI({
                manifestUrl: MANIFEST_URL,
                language: "en",
                restoreConnection: true,
                actionsConfiguration: {
                    twaReturnUrl: TWA_RETURN_URL
                }
            });

            tonConnectUI = ui;
            window.tonConnectUI = ui;

            if (typeof ui.onStatusChange === "function") {
                statusUnsubscribe = ui.onStatusChange(
                    function (wallet) {
                        updateWalletStatus(wallet);
                    },
                    function (error) {
                        console.error(
                            "ChubbyX TON Connect status error:",
                            error
                        );
                    }
                );
            }

            updateWalletStatus(ui.wallet);

            console.log("ChubbyX: TON Connect initialized.");

            return ui;
        })();

        try {
            return await tonConnectStarting;
        } finally {
            tonConnectStarting = null;
        }
    }

    async function openWalletModal() {
        if (walletModalOpening) return;

        walletModalOpening = true;

        const button = getElement("chubbyx-connect-button");

        if (button) {
            button.disabled = true;
            button.textContent = "Opening Wallet...";
        }

        try {
            const ui = await startTonConnect();

            if (ui.wallet && ui.wallet.account) {
                updateWalletStatus(ui.wallet);
                setMessage("Wallet already connected.");
                return;
            }

            if (typeof ui.openModal !== "function") {
                throw new Error(
                    "The TON Connect SDK does not provide openModal()."
                );
            }

            setMessage("Opening wallet selector...");

            // Open the official TON Connect wallet selector.
            const result = await ui.openModal();

            console.log("ChubbyX: openModal result:", result);

        } catch (error) {
            console.error("ChubbyX wallet modal error:", error);

            setMessage(
                "Could not open wallet selector. Please reopen ChubbyX and try again."
            );
        } finally {
            walletModalOpening = false;

            if (button) {
                button.disabled = false;

                button.textContent =
                    getAddress(tonConnectUI && tonConnectUI.wallet)
                        ? "Wallet Connected"
                        : "Connect Wallet";
            }
        }
    }

    async function disconnectWallet() {
        const button = getElement("chubbyx-disconnect-button");

        if (!tonConnectUI) {
            setMessage("Wallet is not initialized.");
            return;
        }

        if (button) {
            button.disabled = true;
            button.textContent = "Disconnecting...";
        }

        try {
            await tonConnectUI.disconnect();

            try {
                localStorage.removeItem("user_wallet");
            } catch (error) {
                console.warn("Could not clear wallet display state.", error);
            }

            updateWalletStatus(null);
            setMessage("Wallet disconnected.");
        } catch (error) {
            console.error("ChubbyX wallet disconnect error:", error);
            setMessage("Could not disconnect wallet. Please try again.");
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = "Disconnect";
            }
        }
    }

    function goBackHome(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Close only the selector. Keep the connection instance alive.
        if (
            tonConnectUI &&
            typeof tonConnectUI.closeModal === "function"
        ) {
            try {
                const result = tonConnectUI.closeModal();

                if (result && typeof result.catch === "function") {
                    result.catch(function (error) {
                        console.warn("Could not close wallet modal.", error);
                    });
                }
            } catch (error) {
                console.warn("Wallet modal may already be closed.", error);
            }
        }

        if (typeof window.switchPage === "function") {
            window.switchPage("home");
        }
    }

    function loadWalletUI() {
        const page = getElement("wallet-page");

        if (!page) {
            console.error("ChubbyX: wallet-page was not found.");
            return;
        }

        if (!walletPageLoaded) {
            page.innerHTML = `
                <h2 class="page-title">Connect Wallet</h2>

                <div style="
                    width:100%;
                    flex:1;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    text-align:center;
                    padding:20px;
                    box-sizing:border-box;
                ">
                    <p id="wallet-status-text" style="
                        color:#ccc;
                        margin-bottom:25px;
                        max-width:280px;
                        font-size:15px;
                    ">Preparing wallet...</p>

                    <button id="chubbyx-connect-button" type="button" style="
                        width:220px;
                        min-height:54px;
                        border:0;
                        border-radius:14px;
                        background:#0098ea;
                        color:white;
                        font-size:16px;
                        font-weight:bold;
                        cursor:pointer;
                        touch-action:manipulation;
                    ">Connect Wallet</button>

                    <div id="wallet-details-box" style="
                        display:none;
                        margin-top:25px;
                        background:rgba(255,255,255,0.06);
                        padding:15px;
                        border-radius:14px;
                        width:100%;
                        max-width:280px;
                        box-sizing:border-box;
                    ">
                        <div style="
                            color:#eeb308;
                            font-weight:bold;
                            margin-bottom:7px;
                        ">Connected Wallet</div>

                        <div id="wallet-address-string" style="
                            color:white;
                            font-size:13px;
                            word-break:break-all;
                        "></div>

                        <button id="chubbyx-disconnect-button" type="button" style="
                            margin-top:15px;
                            width:100%;
                            padding:10px;
                            border:0;
                            border-radius:10px;
                            background:#e74c3c;
                            color:white;
                            font-weight:bold;
                            cursor:pointer;
                        ">Disconnect</button>
                    </div>

                    <button id="chubbyx-back-button" type="button" style="
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
                        touch-action:manipulation;
                    ">← Back to Home</button>
                </div>
            `;

            walletPageLoaded = true;

            getElement("chubbyx-connect-button").addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    openWalletModal();
                }
            );

            getElement("chubbyx-disconnect-button").addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    disconnectWallet();
                }
            );

            getElement("chubbyx-back-button").addEventListener(
                "click",
                goBackHome
            );
        }

        startTonConnect()
            .then(function (ui) {
                updateWalletStatus(ui.wallet);
            })
            .catch(function (error) {
                console.error("ChubbyX wallet initialization error:", error);

                setMessage(
                    "Wallet could not initialize. Check your connection and try again."
                );
            });
    }

    // Public functions used by the existing index.html.
    window.loadWalletUI = loadWalletUI;
    window.walletPage = loadWalletUI;
    window.tonConnectUI = null;

    // Initialize when the page is ready.
    function initializeWalletPage() {
        loadWalletUI();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeWalletPage,
            { once: true }
        );
    } else {
        initializeWalletPage();
    }
})();
