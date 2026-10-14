
/* =========================================
   CHUBBYX — TON CONNECT WALLET
   FIXED INITIALIZATION AND CONNECTION
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

    function getWalletPage() {
        return document.getElementById("wallet-page");
    }

    function setWalletMessage(message) {
        const status = document.getElementById(
            "wallet-status-text"
        );

        if (status) status.textContent = message;
    }

    function shortenAddress(address) {
        if (!address) return "";
        if (address.length <= 14) return address;

        return address.slice(0, 7) +
            "..." +
            address.slice(-7);
    }

    function updateWalletStatus(wallet) {
        const status = document.getElementById(
            "wallet-status-text"
        );

        const box = document.getElementById(
            "wallet-details-box"
        );

        const addressElement = document.getElementById(
            "wallet-address-string"
        );

        const connectButton = document.getElementById(
            "chubbyx-connect-button"
        );

        const connected = Boolean(
            wallet &&
            wallet.account &&
            wallet.account.address
        );

        if (connected) {
            const address = wallet.account.address;

            if (status) {
                status.textContent =
                    "Wallet connected successfully!";
            }

            if (box) box.style.display = "block";

            if (addressElement) {
                addressElement.textContent =
                    shortenAddress(address);
            }

            if (connectButton) {
                connectButton.textContent = "Wallet Connected";
            }

            try {
                localStorage.setItem("user_wallet", address);
            } catch (error) {
                console.warn("Could not save wallet display state.");
            }

        } else {
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

            /*
             * Do not call disconnect here.
             * An empty wallet event must not force a disconnect.
             */
        }
    }

    async function startTonConnect() {
        if (tonConnectUI) return tonConnectUI;

        if (tonConnectStarting) {
            return tonConnectStarting;
        }

        tonConnectStarting = (async function () {
            const library = window.TON_CONNECT_UI;

            if (!library || !library.TonConnectUI) {
                throw new Error(
                    "TON Connect UI library is not loaded. Check its script in index.html."
                );
            }

            const ui = new library.TonConnectUI({
                manifestUrl: MANIFEST_URL
            });

            ui.uiOptions = {
                twaReturnUrl: TWA_RETURN_URL
            };

            ui.onStatusChange(function (wallet) {
                updateWalletStatus(wallet);
            });

            tonConnectUI = ui;

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
        const button = document.getElementById(
            "chubbyx-connect-button"
        );

        if (walletModalOpening) return;

        try {
            if (button) {
                button.disabled = true;
                button.textContent = "Loading Wallet...";
            }

            const ui = await startTonConnect();

            /*
             * If already connected, show the connection.
             * Do not reopen the wallet chooser.
             */
            if (ui.wallet && ui.wallet.account) {
                updateWalletStatus(ui.wallet);
                return;
            }

            walletModalOpening = true;

            if (button) {
                button.textContent = "Opening Wallet...";
            }

            await ui.openModal();

        } catch (error) {
            console.error("ChubbyX wallet error:", error);

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
        if (!tonConnectUI) return;

        try {
            await tonConnectUI.disconnect();
            updateWalletStatus(null);
            setWalletMessage("Wallet disconnected.");
        } catch (error) {
            console.error("ChubbyX disconnect error:", error);
            setWalletMessage("Could not disconnect wallet.");
        }
    }

    function loadWalletUI() {
        const page = getWalletPage();
        if (!page) return;

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

                    <button id="chubbyx-connect-button"
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

                        <button id="chubbyx-disconnect-button"
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
                            ">Disconnect</button>
                    </div>

                    <button id="chubbyx-back-button"
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
                        ">← Back to Home</button>
                </div>
            `;

            walletPageLoaded = true;

            document.getElementById(
                "chubbyx-connect-button"
            ).addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                openChubbyXWallet();
            });

            document.getElementById(
                "chubbyx-disconnect-button"
            ).addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                disconnectChubbyXWallet();
            });

            document.getElementById(
                "chubbyx-back-button"
            ).addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (typeof window.switchPage === "function") {
                    window.switchPage("home");
                }
            });
        }

        /*
         * Prepare TON Connect when the wallet page is opened.
         * Never open its modal automatically.
         */
        startTonConnect()
            .then(function (ui) {
                updateWalletStatus(ui.wallet);
            })
            .catch(function (error) {
                console.error("TON Connect initialization:", error);
                setWalletMessage(
                    "Wallet could not initialize. Check your connection."
                );
            });
    }

    /*
     * Expose the page loader without replacing switchPage.
     * This avoids wrapping switchPage multiple times.
     */
    window.loadWalletUI = loadWalletUI;

    /*
     * Hook into the existing page switch function once.
     */
    function installPageHook() {
        if (window.__chubbyXWalletHookInstalled) return;

        if (typeof window.switchPage !== "function") {
            setTimeout(installPageHook, 100);
            return;
        }

        const originalSwitchPage = window.switchPage;

        window.switchPage = function (pageId, element) {
            const result = originalSwitchPage.apply(this, arguments);

            if (pageId === "wallet" || pageId === "wallet-page") {
                setTimeout(loadWalletUI, 50);
            }

            return result;
        };

        window.__chubbyXWalletHookInstalled = true;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", installPageHook);
    } else {
        installPageHook();
    }
})();
