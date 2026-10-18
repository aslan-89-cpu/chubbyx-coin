
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

    const $ = (id) => document.getElementById(id);

    let tonConnectUI = null;
    let initializing = null;
    let opening = false;
    let disconnecting = false;

    function setMessage(message) {
        const element = $("wallet-status-text");
        if (element) element.textContent = message;
    }

    function getAddress(wallet) {
        return wallet?.account?.address || "";
    }

    function shortAddress(address) {
        return address && address.length > 20
            ? address.slice(0, 9) + "..." + address.slice(-7)
            : address;
    }

    function updateWallet(wallet) {
        const address = getAddress(wallet);
        const details = $("wallet-details-box");
        const addressElement = $("wallet-address-string");
        const connectButton = $("chubbyx-connect-button");

        if (address) {
            setMessage("Wallet connected successfully!");

            if (details) details.style.display = "block";
            if (addressElement) {
                addressElement.textContent = shortAddress(address);
            }
            if (connectButton) {
                connectButton.textContent = "Wallet Connected";
            }

            try {
                localStorage.setItem("user_wallet", address);
            } catch (_) {}
        } else {
            if (details) details.style.display = "none";
            if (addressElement) addressElement.textContent = "";

            if (connectButton) {
                connectButton.textContent = "Connect Wallet";
            }

            if (!opening && !disconnecting) {
                setMessage("Connect your TON wallet");
            }
        }

        // Never modify chubby_coins.
    }

    async function startTonConnect() {
        if (tonConnectUI) return tonConnectUI;
        if (initializing) return initializing;

        initializing = (async function () {
            const sdk = window.TON_CONNECT_UI;

            if (!sdk || typeof sdk.TonConnectUI !== "function") {
                throw new Error(
                    "TON Connect SDK did not load. Check the SDK script in index.html."
                );
            }

            const ui = new sdk.TonConnectUI({
                manifestUrl: MANIFEST_URL,
                language: "en",
                restoreConnection: true,
                actionsConfiguration: {
                    twaReturnUrl: TWA_RETURN_URL
                }
            });

            tonConnectUI = ui;
            window.tonConnectUI = ui;

            ui.onStatusChange(function (wallet) {
                updateWallet(wallet);
            });

            updateWallet(ui.wallet);

            return ui;
        })();

        try {
            return await initializing;
        } finally {
            initializing = null;
        }
    }

    async function connectWallet() {
        if (opening || disconnecting) return;

        opening = true;

        const button = $("chubbyx-connect-button");

        if (button) {
            button.disabled = true;
            button.textContent = "Opening Wallet...";
        }

        try {
            const ui = await startTonConnect();

            if (ui.wallet?.account) {
                updateWallet(ui.wallet);
                setMessage("Your wallet is already connected.");
                return;
            }

            if (typeof ui.openModal !== "function") {
                throw new Error(
                    "TON Connect wallet selector is unavailable."
                );
            }

            setMessage("Opening TON wallet selector...");

            // Open the wallet selector directly.
            // Do not call ui.getWallets() first.
            await ui.openModal();

            if (!ui.wallet?.account) {
                setMessage("Choose a TON wallet in the window that opens.");
            }
        } catch (error) {
            console.error("ChubbyX connect error:", error);

            setMessage(
                "Could not open wallet: " +
                (error?.message || String(error))
            );
        } finally {
            opening = false;

            if (button) {
                button.disabled = false;
                button.textContent = getAddress(tonConnectUI?.wallet)
                    ? "Wallet Connected"
                    : "Connect Wallet";
            }
        }
    }

    async function disconnectWallet() {
        if (disconnecting || opening) return;

        disconnecting = true;

        const button = $("chubbyx-disconnect-button");

        try {
            const ui = await startTonConnect();

            if (button) {
                button.disabled = true;
                button.textContent = "Disconnecting...";
            }

            await ui.disconnect();

            try {
                localStorage.removeItem("user_wallet");
            } catch (_) {}

            updateWallet(null);
            setMessage("Wallet disconnected.");
        } catch (error) {
            console.error("ChubbyX disconnect error:", error);

            setMessage(
                "Could not disconnect: " +
                (error?.message || String(error))
            );
        } finally {
            disconnecting = false;

            if (button) {
                button.disabled = false;
                button.textContent = "Disconnect";
            }
        }
    }

    function backHome(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (tonConnectUI) {
            try {
                tonConnectUI.closeModal();
            } catch (_) {}
        }

        if (typeof window.switchPage === "function") {
            window.switchPage("home");
        }
    }

    function createWalletPage() {
        const page = $("wallet-page");
        if (!page) return;

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
                    max-width:300px;
                    font-size:15px;
                    overflow-wrap:anywhere;
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

                    <button id="chubbyx-disconnect-button"
                        type="button" style="
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

        $("chubbyx-connect-button").addEventListener(
            "click",
            connectWallet
        );

        $("chubbyx-disconnect-button").addEventListener(
            "click",
            disconnectWallet
        );

        $("chubbyx-back-button").addEventListener(
            "click",
            backHome
        );

        startTonConnect()
            .then(function (ui) {
                updateWallet(ui.wallet);
            })
            .catch(function (error) {
                console.error("ChubbyX wallet init error:", error);

                setMessage(
                    "Wallet initialization failed: " +
                    (error?.message || String(error))
                );
            });
    }

    function loadWalletUI() {
        const page = $("wallet-page");
        if (!page) return;

        if (
            !$("chubbyx-connect-button") ||
            !$("chubbyx-back-button")
        ) {
            createWalletPage();
        } else {
            startTonConnect()
                .then(function (ui) {
                    updateWallet(ui.wallet);
                })
                .catch(function (error) {
                    console.error("ChubbyX wallet init error:", error);

                    setMessage(
                        "Wallet initialization failed: " +
                        (error?.message || String(error))
                    );
                });
        }
    }

    window.loadWalletUI = loadWalletUI;
    window.walletPage = loadWalletUI;
    window.chubbyxOpenWallet = connectWallet;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            loadWalletUI,
            { once: true }
        );
    } else {
        loadWalletUI();
    }
})();
