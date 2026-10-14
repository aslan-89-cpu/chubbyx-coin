
/* =========================================
   CHUBBYX — TON CONNECT WALLET
   FULL REPLACEMENT
   Compatible with the existing index.html
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

    function getElement(id) {
        return document.getElementById(id);
    }

    function setWalletMessage(message) {
        const status = getElement("wallet-status-text");

        if (status) {
            status.textContent = message;
        }
    }

    function shortenAddress(address) {
        if (!address) return "";

        if (address.length <= 14) {
            return address;
        }

        return address.slice(0, 7) +
            "..." +
            address.slice(-7);
    }

    function getConnectedAddress(wallet) {
        if (
            wallet &&
            wallet.account &&
            wallet.account.address
        ) {
            return wallet.account.address;
        }

        return null;
    }

    function updateWalletStatus(wallet) {
        const status = getElement("wallet-status-text");
        const box = getElement("wallet-details-box");
        const addressElement = getElement("wallet-address-string");
        const connectButton = getElement("chubbyx-connect-button");

        const address = getConnectedAddress(wallet);

        if (address) {
            if (status) {
                status.textContent = "Wallet connected successfully!";
            }

            if (box) {
                box.style.display = "block";
            }

            if (addressElement) {
                addressElement.textContent = shortenAddress(address);
            }

            if (connectButton) {
                connectButton.textContent = "Wallet Connected";
                connectButton.disabled = false;
            }

            try {
                localStorage.setItem("user_wallet", address);
            } catch (error) {
                console.warn("Could not save wallet display state.");
            }

            return;
        }

        if (status) {
            status.textContent = "Connect your TON wallet";
        }

        if (box) {
            box.style.display = "none";
        }

        if (addressElement) {
            addressElement.textContent = "";
        }

        if (connectButton) {
            connectButton.textContent = "Connect Wallet";
            connectButton.disabled = false;
        }

        /*
         * Do not modify chubby_coins or any coin balance here.
         * A null status event does not trigger a manual disconnect.
         */
    }

    async function startTonConnect() {
        if (tonConnectUI) {
            return tonConnectUI;
        }

        if (tonConnectStarting) {
            return tonConnectStarting;
        }

        tonConnectStarting = (async function () {
            const library = window.TON_CONNECT_UI;

            if (
                !library ||
                typeof library.TonConnectUI !== "function"
            ) {
                throw new Error(
                    "TON Connect UI is unavailable. Check the SDK script in index.html."
                );
            }

            const ui = new library.TonConnectUI({
                manifestUrl: MANIFEST_URL,
                buttonRootId: null,
                language: "en",
                restoreConnection: true,
                actionsConfiguration: {
                    twaReturnUrl: TWA_RETURN_URL
                }
            });

            /*
             * Make the SAME instance available to index.html.
             */
            tonConnectUI = ui;
            window.tonConnectUI = ui;

            ui.onStatusChange(
                function (wallet) {
                    updateWalletStatus(wallet);
                },
                function (error) {
                    console.error(
                        "ChubbyX wallet status error:",
                        error
                    );
                }
            );

            /*
             * Restore the existing connection if one is available.
             */
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

    async function openChubbyXWallet() {
        const button = getElement("chubbyx-connect-button");

        if (walletModalOpening) {
            return;
        }

        walletModalOpening = true;

        if (button) {
            button.disabled = true;
            button.textContent = "Opening Wallet...";
        }

        try {
            const ui = await startTonConnect();

            if (ui.wallet && ui.wallet.account) {
                updateWalletStatus(ui.wallet);
                return;
            }

            setWalletMessage("Choose a TON wallet to connect.");

            /*
             * Open the official TON Connect wallet selector.
             */
            await ui.openModal();

        } catch (error) {
            console.error("ChubbyX wallet connection error:", error);

            setWalletMessage(
                "Could not open wallet. Please try again."
            );

        } finally {
            walletModalOpening = false;

            if (button) {
                button.disabled = false;

                if (
                    tonConnectUI &&
                    tonConnectUI.wallet &&
                    tonConnectUI.wallet.account
                ) {
                    button.textContent = "Wallet Connected";
                } else {
                    button.textContent = "Connect Wallet";
                }
            }
        }
    }

    async function disconnectChubbyXWallet() {
        if (!tonConnectUI) {
            setWalletMessage("Wallet is not initialized.");
            return;
        }

        const button = getElement("chubbyx-disconnect-button");

        if (button) {
            button.disabled = true;
            button.textContent = "Disconnecting...";
        }

        try {
            await tonConnectUI.disconnect();

            updateWalletStatus(null);
            setWalletMessage("Wallet disconnected.");

            try {
                localStorage.removeItem("user_wallet");
            } catch (error) {
                console.warn("Could not update saved wallet state.");
            }

        } catch (error) {
            console.error("ChubbyX disconnect error:", error);

            setWalletMessage(
                "Could not disconnect wallet. Please try again."
            );

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

        /*
         * Close the wallet selector if it is open.
         * Keep the TON Connect instance alive for the next visit.
         */
        if (
            window.tonConnectUI &&
            typeof window.tonConnectUI.closeModal === "function"
        ) {
            try {
                window.tonConnectUI.closeModal();
            } catch (error) {
                console.warn("Wallet modal was already closed.");
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

                    <button
                        id="chubbyx-connect-button"
                        type="button"
                        style="
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
                        ">
                        Connect Wallet
                    </button>

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

                        <button
                            id="chubbyx-disconnect-button"
                            type="button"
                            style="
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

                    <button
                        id="chubbyx-back-button"
                        type="button"
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
                            touch-action:manipulation;
                        ">← Back to Home</button>
                </div>
            `;

            walletPageLoaded = true;

            const connectButton =
                getElement("chubbyx-connect-button");

            const disconnectButton =
                getElement("chubbyx-disconnect-button");

            const backButton =
                getElement("chubbyx-back-button");

            if (connectButton) {
                connectButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    openChubbyXWallet();
                });
            }

            if (disconnectButton) {
                disconnectButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    disconnectChubbyXWallet();
                });
            }

            if (backButton) {
                backButton.addEventListener("click", goBackHome);
            }
        }

        /*
         * Initialize once; do not open the selector automatically.
         */
        startTonConnect()
            .then(function (ui) {
                updateWalletStatus(ui.wallet);
            })
            .catch(function (error) {
                console.error(
                    "ChubbyX wallet initialization error:",
                    error
                );

                setWalletMessage(
                    "Wallet could not initialize. Check your internet connection and try again."
                );
            });
    }

    /*
     * Compatibility with the existing index.html.
     * index.html calls window.walletPage() when Wallet opens.
     */
    window.loadWalletUI = loadWalletUI;
    window.walletPage = loadWalletUI;

    /*
     * Expose the same TON Connect instance for index.html.
     */
    window.tonConnectUI = null;

    /*
     * Load the wallet UI once the document is ready.
     */
    function initializeWalletPage() {
        installPageHook();

        if (getWalletPage()) {
            loadWalletUI();
        }
    }

    /*
     * Do not repeatedly wrap switchPage.
     * The existing index.html can call window.walletPage() directly.
     */
    function installPageHook() {
        if (window.__chubbyXWalletHookInstalled) {
            return;
        }

        if (typeof window.switchPage !== "function") {
            return;
        }

        const originalSwitchPage = window.switchPage;

        window.switchPage = function (pageId, element) {
            const result = originalSwitchPage.apply(this, arguments);

            if (pageId === "wallet" || pageId === "wallet-page") {
                loadWalletUI();
            }

            return result;
        };

        window.__chubbyXWalletHookInstalled = true;
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
