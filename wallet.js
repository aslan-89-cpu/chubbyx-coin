/* =========================================
CHUBBYX — TON CONNECT WALLET
FULL REPLACEMENT
Preserves existing coin balances
========================================= */

(function () {
“use strict”;

const MANIFEST_URL =
    "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";
const TWA_RETURN_URL =
    "https://t.me/ChubbyX_Coin_bot/chubbyx";
let tonConnectUI = null;
let tonConnectStarting = null;
let walletModalOpening = false;
let walletPageLoaded = false;
const $ = (id) => document.getElementById(id);
function setMessage(message) {
    const element = $("wallet-status-text");
    if (element) element.textContent = message;
}
function getAddress(wallet) {
    return wallet?.account?.address || "";
}
function shortenAddress(address) {
    if (!address) return "";
    return address.length > 18
        ? address.slice(0, 9) + "..." + address.slice(-7)
        : address;
}
function updateWalletStatus(wallet) {
    const address = getAddress(wallet);
    const status = $("wallet-status-text");
    const details = $("wallet-details-box");
    const addressElement = $("wallet-address-string");
    const connectButton = $("chubbyx-connect-button");
    if (address) {
        if (status) {
            status.textContent = "Wallet connected successfully!";
        }
        if (details) details.style.display = "block";
        if (addressElement) {
            addressElement.textContent = shortenAddress(address);
        }
        if (connectButton) {
            connectButton.textContent = "Wallet Connected";
        }
        try {
            localStorage.setItem("user_wallet", address);
        } catch (_) {}
    } else {
        if (status) status.textContent = "Connect your TON wallet";
        if (details) details.style.display = "none";
        if (addressElement) addressElement.textContent = "";
        if (connectButton) {
            connectButton.textContent = "Connect Wallet";
        }
    }
    // Never modify chubby_coins or any existing coin balance.
}
async function startTonConnect() {
    if (tonConnectUI) return tonConnectUI;
    if (tonConnectStarting) return tonConnectStarting;
    tonConnectStarting = (async function () {
        if (
            !window.TON_CONNECT_UI ||
            typeof window.TON_CONNECT_UI.TonConnectUI !== "function"
        ) {
            throw new Error(
                "TON Connect SDK did not load. Check index.html."
            );
        }
        const ui = new window.TON_CONNECT_UI.TonConnectUI({
            manifestUrl: MANIFEST_URL,
            language: "en",
            restoreConnection: true,
            actionsConfiguration: {
                twaReturnUrl: TWA_RETURN_URL
            }
        });
        tonConnectUI = ui;
        window.tonConnectUI = ui;
        ui.onStatusChange(
            function (wallet) {
                updateWalletStatus(wallet);
            },
            function (error) {
                console.error("ChubbyX wallet status error:", error);
                setMessage("Wallet status error. Please try again.");
            }
        );
        updateWalletStatus(ui.wallet);
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
    const button = $("chubbyx-connect-button");
    if (button) {
        button.disabled = true;
        button.textContent = "Opening Wallet...";
    }
    try {
        const ui = await startTonConnect();
        if (ui.wallet?.account) {
            updateWalletStatus(ui.wallet);
            setMessage("Wallet already connected.");
            return;
        }
        setMessage("Loading available TON wallets...");
        const wallets = await ui.getWallets();
        console.log(
            "ChubbyX available TON wallets:",
            wallets.map(function (wallet) {
                return wallet.name;
            })
        );
        if (!Array.isArray(wallets) || wallets.length === 0) {
            throw new Error(
                "No TON wallets found. Check your internet connection."
            );
        }
        setMessage("Opening wallet selector...");
        await ui.openModal();
    } catch (error) {
        console.error("ChubbyX wallet opening failed:", error);
        setMessage(
            "Wallet error: " +
            (error?.message || String(error))
        );
    } finally {
        walletModalOpening = false;
        const currentButton = $("chubbyx-connect-button");
        if (currentButton) {
            currentButton.disabled = false;
            currentButton.textContent = getAddress(
                tonConnectUI?.wallet
            )
                ? "Wallet Connected"
                : "Connect Wallet";
        }
    }
}
async function disconnectWallet() {
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
        updateWalletStatus(null);
        setMessage("Wallet disconnected.");
    } catch (error) {
        console.error("ChubbyX disconnect failed:", error);
        setMessage(
            "Could not disconnect: " +
            (error?.message || String(error))
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
    if (tonConnectUI) {
        try {
            tonConnectUI.closeModal();
        } catch (error) {
            console.warn("Wallet modal close:", error);
        }
    }
    if (typeof window.switchPage === "function") {
        window.switchPage("home");
    } else {
        console.error(
            "ChubbyX: switchPage('home') was not found in index.html."
        );
        setMessage("Unable to return home. Please check index.html.");
    }
}
function loadWalletUI() {
    const page = $("wallet-page");
    if (!page) {
        console.error("ChubbyX: wallet-page not found.");
        return;
    }
    // Rebuild the wallet UI if another part of the app removed it.
    if (
        !walletPageLoaded ||
        !$("chubbyx-connect-button") ||
        !$("chubbyx-back-button")
    ) {
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
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                openWalletModal();
            }
        );
        $("chubbyx-disconnect-button").addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                disconnectWallet();
            }
        );
        $("chubbyx-back-button").addEventListener(
            "click",
            goBackHome
        );
        walletPageLoaded = true;
    }
    startTonConnect()
        .then(function (ui) {
            updateWalletStatus(ui.wallet);
        })
        .catch(function (error) {
            console.error(
                "ChubbyX wallet initialization failed:",
                error
            );
            setMessage(
                "Wallet initialization failed: " +
                (error?.message || String(error))
            );
        });
}
window.loadWalletUI = loadWalletUI;
window.walletPage = loadWalletUI;
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