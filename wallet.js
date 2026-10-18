
/* =========================================
   CHUBBYX — TON CONNECT WALLET
   FULL REPLACEMENT
   Does NOT modify coin balances
========================================= */

(function () {
    "use strict";

    const MANIFEST_URL =
        "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

    const TWA_RETURN_URL =
        "https://t.me/ChubbyX_Coin_bot/chubbyx";

    const SDK_URLS = [
        "https://unpkg.com/@tonconnect/ui@5.0.0/dist/tonconnect-ui.min.js",
        "https://cdn.jsdelivr.net/npm/@tonconnect/ui@5.0.0/dist/tonconnect-ui.min.js"
    ];

    const $ = (id) => document.getElementById(id);

    let tonConnectUI = null;
    let initPromise = null;
    let sdkPromise = null;
    let busy = false;

    function setMessage(message) {
        const el = $("wallet-status-text");
        if (el) el.textContent = message;
    }

    function getAddress(wallet) {
        return wallet?.account?.address || "";
    }

    function shortAddress(address) {
        if (!address) return "";
        return address.length > 22
            ? address.slice(0, 10) + "..." + address.slice(-8)
            : address;
    }

    function updateWallet(wallet) {
        const address = getAddress(wallet);
        const details = $("wallet-details-box");
        const addressEl = $("wallet-address-string");
        const connectBtn = $("chubbyx-connect-button");

        if (address) {
            setMessage("Wallet connected successfully!");

            if (details) details.style.display = "block";
            if (addressEl) addressEl.textContent = shortAddress(address);
            if (connectBtn) connectBtn.textContent = "Wallet Connected";

            try {
                localStorage.setItem("user_wallet", address);
            } catch (_) {}
        } else {
            if (details) details.style.display = "none";
            if (addressEl) addressEl.textContent = "";
            if (connectBtn) connectBtn.textContent = "Connect Wallet";
        }

        // IMPORTANT: Never read, reset, or modify chubby_coins.
    }

    function loadSdk() {
        if (
            window.TON_CONNECT_UI &&
            typeof window.TON_CONNECT_UI.TonConnectUI === "function"
        ) {
            return Promise.resolve(window.TON_CONNECT_UI);
        }

        if (sdkPromise) return sdkPromise;

        sdkPromise = (async function () {
            for (const url of SDK_URLS) {
                try {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement("script");
                        script.src = url;
                        script.async = true;
                        script.onload = resolve;
                        script.onerror = () => {
                            script.remove();
                            reject(new Error("Could not load SDK from " + url));
                        };
                        document.head.appendChild(script);
                    });

                    if (
                        window.TON_CONNECT_UI &&
                        typeof window.TON_CONNECT_UI.TonConnectUI === "function"
                    ) {
                        return window.TON_CONNECT_UI;
                    }
                } catch (error) {
                    console.warn("TON Connect SDK source failed:", url);
                }
            }

            throw new Error(
                "TON Connect SDK could not load. Check your internet connection and reload the app."
            );
        })();

        try {
            return await sdkPromise;
        } catch (error) {
            sdkPromise = null;
            throw error;
        }
    }

    async function startTonConnect() {
        if (tonConnectUI) return tonConnectUI;
        if (initPromise) return initPromise;

        initPromise = (async function () {
            const sdk = await loadSdk();

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
            return await initPromise;
        } finally {
            initPromise = null;
        }
    }

    async function connectWallet() {
        if (busy) return;
        busy = true;

        const button = $("chubbyx-connect-button");
        if (button) {
            button.disabled = true;
            button.textContent = "Loading...";
        }

        try {
            setMessage("Loading TON Connect...");

            const ui = await startTonConnect();

            if (ui.wallet?.account) {
                updateWallet(ui.wallet);
                setMessage("Your wallet is already connected.");
                return;
            }

            setMessage("Opening wallet selector...");

            if (typeof ui.openModal !== "function") {
                throw new Error(
                    "Wallet selector is unavailable in this SDK."
                );
            }

            await ui.openModal();

            setMessage("Choose a TON wallet in the window that opens.");

            if (typeof ui.onModalStateChange === "function") {
                // Show a useful message if the selector closes.
                ui.onModalStateChange(function (state) {
                    if (getAddress(ui.wallet)) return;

                    if (state?.status === "closed") {
                        setMessage(
                            "Wallet selector closed. Tap Connect Wallet to try again."
                        );
                    }
                });
            }
        } catch (error) {
            console.error("ChubbyX wallet error:", error);
            setMessage(
                "Wallet error: " + (error?.message || String(error))
            );
        } finally {
            busy = false;

            if (button) {
                button.disabled = false;
                button.textContent = getAddress(tonConnectUI?.wallet)
                    ? "Wallet Connected"
                    : "Connect Wallet";
            }
        }
    }

    async function disconnectWallet() {
        if (busy) return;
        busy = true;

        const button = $("chubbyx-disconnect-button");

        try {
            const ui = await startTonConnect();
            if (button) button.disabled = true;

            await ui.disconnect();

            try {
                localStorage.removeItem("user_wallet");
            } catch (_) {}

            updateWallet(null);
            setMessage("Wallet disconnected.");
        } catch (error) {
            console.error("ChubbyX disconnect error:", error);
            setMessage(
                "Disconnect error: " + (error?.message || String(error))
            );
        } finally {
            busy = false;
            if (button) button.disabled = false;
        }
    }

    function backHome(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            if (tonConnectUI) tonConnectUI.closeModal();
        } catch (_) {}

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

                    <button id="chubbyx-disconnect-button" type="button"
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
                ">← Back to Home</button>
            </div>
        `;

        $("chubbyx-connect-button").addEventListener(
            "click", connectWallet
        );

        $("chubbyx-disconnect-button").addEventListener(
            "click", disconnectWallet
        );

        $("chubbyx-back-button").addEventListener(
            "click", backHome
        );

        startTonConnect()
            .then(function (ui) {
                updateWallet(ui.wallet);
                if (!getAddress(ui.wallet)) {
                    setMessage("Ready. Tap Connect Wallet.");
                }
            })
            .catch(function (error) {
                console.error("ChubbyX wallet initialization:", error);
                setMessage(
                    "Wallet setup error: " +
                    (error?.message || String(error))
                );
            });
    }

    function loadWalletUI() {
        const page = $("wallet-page");
        if (!page) return;

        if (!$("chubbyx-connect-button")) {
            createWalletPage();
        } else {
            startTonConnect()
                .then(function (ui) {
                    updateWallet(ui.wallet);
                })
                .catch(function (error) {
                    console.error("ChubbyX wallet initialization:", error);
                    setMessage(
                        "Wallet setup error: " +
                        (error?.message || String(error))
                    );
                });
        }
    }

    window.loadWalletUI = loadWalletUI;
    window.walletPage = loadWalletUI;
    window.chubbyxOpenWallet = connectWallet;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadWalletUI, {
            once: true
        });
    } else {
        loadWalletUI();
    }
})();
