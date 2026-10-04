<!-- =========================================
     CHUBBYX — WALLET PAGE
========================================= -->

<div id="wallet-page" class="wallet-page">

  <!-- TOP BACK -->
  <button
    id="wallet-back-top"
    type="button"
    class="wallet-back-top"
    aria-label="Back"
  >
    &gt;
  </button>

  <!-- TITLE -->
  <div class="wallet-title">
    <h2>Wallet</h2>
    <p id="wallet-message">Connect your TON wallet</p>
  </div>

  <!-- WALLET AREA -->
  <div class="wallet-box">

    <div id="wallet-status">
      Not Connected
    </div>

    <button
      id="connect-wallet-btn"
      type="button"
      class="wallet-btn connect-btn"
    >
      Connect Wallet
    </button>

    <button
      id="disconnect-wallet-btn"
      type="button"
      class="wallet-btn disconnect-btn"
      style="display:none;"
    >
      Disconnect
    </button>

  </div>

  <!-- BOTTOM BACK -->
  <button
    id="wallet-back-home"
    type="button"
    class="back-home-btn"
  >
    Back to Home
  </button>

</div>


<style>
/* =========================================
   CHUBBYX — WALLET STYLE
========================================= */

.wallet-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding: 80px 20px 110px;
  text-align: center;
}

.wallet-back-top {
  position: absolute;
  top: 20px;
  left: 20px;

  width: 45px;
  height: 45px;

  border: none;
  border-radius: 50%;

  background: rgba(255,255,255,0.12);
  color: white;

  font-size: 30px;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  z-index: 9999;
}

.wallet-title h2 {
  margin: 0;
  color: white;
  font-size: 28px;
}

.wallet-title p {
  margin-top: 8px;
  color: #aaa;
  font-size: 14px;
}

.wallet-box {
  margin-top: 35px;
  padding: 25px 20px;

  border-radius: 20px;

  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
}

#wallet-status {
  color: white;
  font-size: 16px;
  margin-bottom: 20px;
  word-break: break-word;
}

.wallet-btn {
  width: 100%;
  max-width: 320px;

  padding: 15px;

  border: none;
  border-radius: 14px;

  font-size: 16px;
  font-weight: bold;

  cursor: pointer;
}

.connect-btn {
  background: #ffffff;
  color: #111;
}

.disconnect-btn {
  background: #ff4d4d;
  color: white;
}

.back-home-btn {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 25px;

  width: calc(100% - 40px);
  max-width: 400px;

  margin: auto;

  padding: 15px;

  border: none;
  border-radius: 15px;

  background: rgba(255,255,255,0.12);
  color: white;

  font-size: 16px;
  font-weight: bold;

  cursor: pointer;

  z-index: 9999;
}
</style>


<script>
/* =========================================
   CHUBBYX — TON CONNECT
========================================= */

let tonConnectUI = null;
let walletPageLoaded = false;
let walletOpening = false;

const MANIFEST_URL =
  "https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

const TWA_RETURN_URL =
  "https://t.me/ChubbyX_Coin_bot/chubbyx";


/* =========================================
   WAIT FOR TON CONNECT
========================================= */

function waitForTonConnectSDK() {
  return new Promise((resolve) => {

    if (
      window.TON_CONNECT_UI &&
      window.TON_CONNECT_UI.TonConnectUI
    ) {
      resolve();
      return;
    }

    const timer = setInterval(() => {

      if (
        window.TON_CONNECT_UI &&
        window.TON_CONNECT_UI.TonConnectUI
      ) {
        clearInterval(timer);
        resolve();
      }

    }, 100);

  });
}


/* =========================================
   START TON CONNECT
========================================= */

async function startTonConnect() {

  await waitForTonConnectSDK();

  if (tonConnectUI) {
    return tonConnectUI;
  }

  tonConnectUI =
    new window.TON_CONNECT_UI.TonConnectUI({
      manifestUrl: MANIFEST_URL
    });

  tonConnectUI.uiOptions = {
    twaReturnUrl: TWA_RETURN_URL
  };


  /* Wallet status changed */

  tonConnectUI.onStatusChange((wallet) => {

    updateWalletUI(wallet);

  });


  /* Restore existing connection */

  try {

    await tonConnectUI.connectionRestored;

  } catch (error) {

    console.log(
      "TON connection restore:",
      error
    );

  }


  updateWalletUI(
    tonConnectUI.wallet
  );


  return tonConnectUI;
}


/* =========================================
   CONNECT WALLET
========================================= */

async function openWallet(event) {

  if (event) {

    event.preventDefault();
    event.stopImmediatePropagation();

  }

  if (walletOpening) {
    return;
  }

  walletOpening = true;

  try {

    const ui = await startTonConnect();

    if (!ui) {
      return;
    }


    /* Already connected */

    if (ui.wallet) {

      updateWalletUI(ui.wallet);
      return;

    }


    /* OPEN WALLET LIST ONLY HERE */

    await ui.openModal();

  } catch (error) {

    console.error(
      "TON Connect error:",
      error
    );

  } finally {

    walletOpening = false;

  }

}


/* =========================================
   DISCONNECT
========================================= */

async function disconnectWallet(event) {

  if (event) {

    event.preventDefault();
    event.stopImmediatePropagation();

  }

  try {

    if (tonConnectUI) {

      await tonConnectUI.disconnect();

    }

  } catch (error) {

    console.error(
      "Disconnect error:",
      error
    );

  }

}


/* =========================================
   UPDATE WALLET UI
========================================= */

function updateWalletUI(wallet) {

  const status =
    document.getElementById(
      "wallet-status"
    );

  const connectBtn =
    document.getElementById(
      "connect-wallet-btn"
    );

  const disconnectBtn =
    document.getElementById(
      "disconnect-wallet-btn"
    );

  const message =
    document.getElementById(
      "wallet-message"
    );


  if (!status) {
    return;
  }


  if (wallet) {

    let address =
      wallet.account &&
      wallet.account.address
        ? wallet.account.address
        : "";


    if (address.length > 16) {

      address =
        address.substring(0, 8) +
        "..." +
        address.substring(
          address.length - 8
        );

    }


    status.textContent =
      "Connected: " + address;


    if (message) {

      message.textContent =
        "Wallet connected";

    }


    if (connectBtn) {

      connectBtn.style.display =
        "none";

    }


    if (disconnectBtn) {

      disconnectBtn.style.display =
        "block";

    }

  } else {

    status.textContent =
      "Not Connected";


    if (message) {

      message.textContent =
        "Connect your TON wallet";

    }


    if (connectBtn) {

      connectBtn.style.display =
        "block";

    }


    if (disconnectBtn) {

      disconnectBtn.style.display =
        "none";

    }

  }

}


/* =========================================
   GO HOME — IMPORTANT
   THIS WILL NOT OPEN WALLET LIST
========================================= */

async function goHome(event) {

  if (event) {

    event.preventDefault();

    event.stopPropagation();

    event.stopImmediatePropagation();

  }


  /* Close TON Connect modal first */

  try {

    if (
      tonConnectUI &&
      typeof tonConnectUI.closeModal === "function"
    ) {

      await tonConnectUI.closeModal();

    }

  } catch (error) {

    console.log(
      "TON modal close:",
      error
    );

  }


  /* Make sure no wallet opening is active */

  walletOpening = false;


  /* Go Home */

  const homeNav =
    document.getElementById(
      "default-nav"
    );


  if (
    typeof window.switchPage ===
    "function"
  ) {

    window.switchPage(
      "home",
      homeNav
    );

  }

}


/* =========================================
   BUTTON EVENTS
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const connectBtn =
      document.getElementById(
        "connect-wallet-btn"
      );

    const disconnectBtn =
      document.getElementById(
        "disconnect-wallet-btn"
      );

    const backTop =
      document.getElementById(
        "wallet-back-top"
      );

    const backHome =
      document.getElementById(
        "wallet-back-home"
      );


    /* CONNECT */

    if (connectBtn) {

      connectBtn.addEventListener(
        "click",
        openWallet,
        true
      );

    }


    /* DISCONNECT */

    if (disconnectBtn) {

      disconnectBtn.addEventListener(
        "click",
        disconnectWallet,
        true
      );

    }


    /* TOP > */

    if (backTop) {

      backTop.addEventListener(
        "click",
        goHome,
        true
      );

    }


    /* BOTTOM BACK TO HOME */

    if (backHome) {

      backHome.addEventListener(
        "click",
        goHome,
        true
      );

    }


    /* Start TON Connect */

    startTonConnect();

  }
);
</script>