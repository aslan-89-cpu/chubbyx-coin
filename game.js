/* =========================================
CHUBBYX — GAME.JS
GOLD SPIN WHEELS
========================================= */

(() => {
“use strict”;

const NORMAL_PRIZES = [0, 0, 5000, 5000, 10000, 15000];
const VIP_PRIZES = [25000, 25000, 50000, 50000, 75000, 100000];

const VIP_WALLET = “UQCj1SXYrtKqtBSSL5_UbtpCfc_UampTdab7jJdUeQlPodxi”;
const NORMAL_COOLDOWN = 24 * 60 * 60 * 1000;

const KEYS = {
normalLast: “chubbyx_normal_spin_last”,
vipCount: “chubbyx_vip_spin_count”,
coins: “chubby_coins”
};

let activeWheel = “normal”;
let spinning = false;
let normalRotation = 0;
let vipRotation = 0;

function getCoins() {
return Math.max(0, Number(localStorage.getItem(KEYS.coins)) || 0);
}

function formatCoins(n) {
return Number(n).toLocaleString(“en-US”);
}

function getVipPrice() {
const count = Math.max(0, Number(localStorage.getItem(KEYS.vipCount)) || 0);
return (0.25 + count * 0.05).toFixed(2);
}

function getNormalRemaining() {
const last = Number(localStorage.getItem(KEYS.normalLast)) || 0;
return Math.max(0, NORMAL_COOLDOWN - (Date.now() - last));
}

function formatTime(ms) {
const total = Math.ceil(ms / 1000);
const h = Math.floor(total / 3600);
const m = Math.floor((total % 3600) / 60);
const s = total % 60;
return ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")};
}

function wheelSVG(prizes, type) {
const colors = [”#f5d76e”, “#b77b15”, “#ffe9a0”, “#d49a27”, “#fff0b5”, “#a96808”];
const cx = 150, cy = 150, r = 136;
const step = 360 / prizes.length;

function point(angle, radius) {
  const rad = (angle - 90) * Math.PI / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  };
}
const sectors = prizes.map((prize, i) => {
  const start = point(i * step, r);
  const end = point((i + 1) * step, r);
  const mid = i * step + step / 2;
  const label = point(mid, 88);
  const large = step > 180 ? 1 : 0;
  return `
    <path d="M ${cx} ${cy} L ${start.x} ${start.y}
      A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z"
      fill="${colors[i]}" stroke="#6f4208" stroke-width="2"/>
    <text x="${label.x}" y="${label.y}"
      transform="rotate(${mid}, ${label.x}, ${label.y})"
      text-anchor="middle" dominant-baseline="middle"
      fill="#281704" font-size="${prize >= 100000 ? 12 : 14}"
      font-weight="900">${formatCoins(prize)}</text>
  `;
}).join("");
return `
  <div class="cx-wheel-frame">
    <div class="cx-pointer"></div>
    <svg id="cx-wheel-${type}" class="cx-wheel-svg"
      viewBox="0 0 300 300" role="img"
      aria-label="${type === "normal" ? "Normal" : "VIP"} prize wheel">
      <circle cx="150" cy="150" r="147" fill="#4b2b06"/>
      <circle cx="150" cy="150" r="142" fill="#f6d36d"/>
      <g class="cx-wheel-rotor">
        ${sectors}
      </g>
      <circle cx="150" cy="150" r="39" fill="#301b07" stroke="#ffdf76" stroke-width="5"/>
      <circle cx="150" cy="150" r="32" fill="#6c430e" stroke="#fff0b5" stroke-width="1.5"/>
      <text x="150" y="146" text-anchor="middle"
        fill="#ffdf76" font-size="11" font-weight="900">ChubbyX</text>
      <text x="150" y="161" text-anchor="middle"
        fill="#ffffff" font-size="8" font-weight="700">${type === "normal" ? "NORMAL" : "VIP SPIN"}</text>
    </svg>
  </div>
`;

}

function injectStyles() {
if (document.getElementById(“cx-game-styles”)) return;

const style = document.createElement("style");
style.id = "cx-game-styles";
style.textContent = `
  #games-page .cx-game {
    box-sizing: border-box;
    width: 100%;
    min-height: 100%;
    padding: 18px 14px 100px;
    color: #fff;
    font-family: Arial, sans-serif;
    text-align: center;
  }
  #games-page .cx-game * { box-sizing: border-box; }
  #games-page .cx-game-title {
    margin: 5px 0 5px;
    color: #f6d36d;
    font-size: 28px;
    font-weight: 1000;
    letter-spacing: 1px;
    text-shadow: 0 0 15px #a56c19;
  }
  #games-page .cx-game-subtitle {
    color: #d4c9e8;
    font-size: 12px;
    margin-bottom: 18px;
  }
  #games-page .cx-tabs {
    display: flex;
    gap: 10px;
    margin: 0 auto 18px;
    max-width: 400px;
  }
  #games-page .cx-tab {
    flex: 1;
    border: 1px solid #9b711f;
    border-radius: 13px;
    padding: 12px 8px;
    color: #f4d77b;
    background: #211832;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
  }
  #games-page .cx-tab.active {
    color: #281704;
    background: linear-gradient(135deg,#fff0b1,#dba52e);
    border-color: #ffe69a;
  }
  #games-page .cx-prize-card {
    max-width: 420px;
    margin: 0 auto;
    padding: 16px 10px 20px;
    border: 1px solid #71501d;
    border-radius: 22px;
    background: linear-gradient(180deg,#211832,#151020);
    box-shadow: 0 8px 24px #0005;
  }
  #games-page .cx-wheel-frame {
    width: min(78vw, 310px);
    aspect-ratio: 1;
    margin: 8px auto 20px;
    position: relative;
  }
  #games-page .cx-wheel-svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
    filter: drop-shadow(0 8px 8px #0007);
  }
  #games-page .cx-wheel-rotor {
    transform-origin: 150px 150px;
    transform-box: view-box;
  }
  #games-page .cx-pointer {
    position: absolute;
    z-index: 2;
    top: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 29px solid #fff0ad;
    filter: drop-shadow(0 2px 2px #000);
  }
  #games-page .cx-balance {
    color: #ffe18a;
    font-size: 15px;
    font-weight: 900;
    margin: 8px 0 12px;
  }
  #games-page .cx-info {
    min-height: 36px;
    color: #d8cee9;
    font-size: 12px;
    line-height: 1.6;
    margin: 10px 0;
  }
  #games-page .cx-spin-btn {
    display: block;
    width: 100%;
    max-width: 280px;
    min-height: 48px;
    margin: 12px auto 0;
    border: 0;
    border-radius: 14px;
    background: linear-gradient(135deg,#fff0b1,#e0ad39,#b97b12);
    color: #291904;
    font-size: 16px;
    font-weight: 1000;
    box-shadow: 0 4px 0 #80500d;
    cursor: pointer;
  }
  #games-page .cx-spin-btn:disabled {
    opacity: .55;
    cursor: not-allowed;
  }
  #games-page .cx-result {
    display: none;
    margin: 14px auto 0;
    padding: 12px;
    max-width: 320px;
    border-radius: 12px;
    color: #ffe18a;
    background: #352448;
    font-size: 16px;
    font-weight: 900;
  }
  #games-page .cx-vip-note {
    color: #ffcf80;
    font-size: 11px;
    line-height: 1.6;
    margin: 12px auto 0;
    max-width: 350px;
  }
  #games-page .cx-wallet-address {
    overflow-wrap: anywhere;
    font-size: 10px;
    color: #bdb0d0;
    margin-top: 10px;
  }
`;
document.head.appendChild(style);

}

function gamePage() {
const host = document.getElementById(“games-page”);
if (!host) return;

injectStyles();
host.innerHTML = `
  <section class="cx-game">
    <h1 class="cx-game-title">ChubbyX</h1>
    <div class="cx-game-subtitle">SPIN • WIN • HAVE FUN</div>
    <div class="cx-tabs">
      <button type="button" class="cx-tab ${activeWheel === "normal" ? "active" : ""}" data-wheel="normal">
        🟡 NORMAL SPIN
      </button>
      <button type="button" class="cx-tab ${activeWheel === "vip" ? "active" : ""}" data-wheel="vip">
        👑 VIP SPIN
      </button>
    </div>
    <div class="cx-prize-card">
      <div class="cx-balance">🪙 Balance: <span id="cx-game-balance">${formatCoins(getCoins())}</span> ChubbyX</div>
      ${wheelSVG(activeWheel === "normal" ? NORMAL_PRIZES : VIP_PRIZES, activeWheel)}
      <div class="cx-info" id="cx-game-info"></div>
      <button type="button" class="cx-spin-btn" id="cx-spin-button">SPIN NOW</button>
      <div class="cx-result" id="cx-spin-result"></div>
    </div>
    <div class="cx-vip-note" id="cx-vip-note">
      Rewards shown are demo rewards until server verification is installed.
    </div>
  </section>
`;
updateGameUI();

}

function updateGameUI() {
const host = document.getElementById(“games-page”);
if (!host || !host.querySelector(”.cx-game”)) return;

const normal = activeWheel === "normal";
const info = document.getElementById("cx-game-info");
const btn = document.getElementById("cx-spin-button");
const vipNote = document.getElementById("cx-vip-note");
host.querySelectorAll(".cx-tab").forEach(tab => {
  tab.classList.toggle("active", tab.dataset.wheel === activeWheel);
});
const remaining = getNormalRemaining();
if (normal) {
  info.textContent = remaining > 0
    ? `Next free spin in ${formatTime(remaining)}`
    : "One free spin every 24 hours.";
  btn.textContent = remaining > 0 ? `WAIT ${formatTime(remaining)}` : "🎡 SPIN NOW";
  btn.disabled = spinning || remaining > 0;
  vipNote.textContent = "Normal spin has no TON fee. The 24-hour limit is stored on this device and is not secure against resets.";
} else {
  info.textContent = `VIP demo price: ${getVipPrice()} TON`;
  btn.textContent = `👑 VIP SPIN • ${getVipPrice()} TON`;
  btn.disabled = spinning;
  vipNote.innerHTML =
    `VIP payment is not verified automatically in this client-only version. Do not send TON expecting an actual verified reward.`;
}
const balance = document.getElementById("cx-game-balance");
if (balance) balance.textContent = formatCoins(getCoins());

}

function spinWheel() {
if (spinning) return;

if (activeWheel === "normal" && getNormalRemaining() > 0) {
  updateGameUI();
  return;
}
if (activeWheel === "vip") {
  showResult("VIP is in demo mode. Real TON payment verification is not connected yet.");
  return;
}
spinning = true;
const btn = document.getElementById("cx-spin-button");
if (btn) {
  btn.disabled = true;
  btn.textContent = "SPINNING...";
}
const prizes = NORMAL_PRIZES;
const chosenIndex = Math.floor(Math.random() * prizes.length);
const prize = prizes[chosenIndex];
const svg = document.getElementById("cx-wheel-normal");
const rotor = svg && svg.querySelector(".cx-wheel-rotor");
// The pointer sits at the top. Aim the selected sector's center at it.
const sector = 360 / prizes.length;
const targetAngle = 360 - (chosenIndex * sector + sector / 2);
normalRotation += 360 * 6 + targetAngle;
if (rotor) {
  rotor.style.transition = "transform 4.5s cubic-bezier(0.12, 0.72, 0.12, 1)";
  rotor.style.transform = `rotate(${normalRotation}deg)`;
}
window.setTimeout(() => {
  localStorage.setItem(KEYS.normalLast, String(Date.now()));
  // This is a client-side demo balance, not a server-verified reward.
  if (prize > 0) {
    localStorage.setItem(KEYS.coins, String(getCoins() + prize));
  }
  spinning = false;
  showResult(prize === 0
    ? "😅 No prize this time!"
    : `🎉 You won ${formatCoins(prize)} ChubbyX! (Demo reward)`);
  updateGameUI();
}, 4700);

}

function showResult(message) {
const result = document.getElementById(“cx-spin-result”);
if (!result) return;
result.textContent = message;
result.style.display = “block”;
}

function handleGameClick(event) {
const tab = event.target.closest(”[data-wheel]”);
if (tab) {
if (spinning) return;
activeWheel = tab.dataset.wheel;
gamePage();
return;
}

if (event.target.closest("#cx-spin-button")) {
  spinWheel();
}

}

function startTimer() {
window.setInterval(() => {
if (activeWheel === “normal”) updateGameUI();
}, 1000);
}

function connectGamePage() {
const originalSwitchPage = window.switchPage;
if (typeof originalSwitchPage === “function” && !originalSwitchPage.__cxGameWrapped) {
const wrapped = function(pageId, element) {
const result = originalSwitchPage.apply(this, arguments);
if (pageId === “games”) gamePage();
return result;
};
wrapped.__cxGameWrapped = true;
window.switchPage = wrapped;
}

const host = document.getElementById("games-page");
if (host && !host.dataset.cxGameListener) {
  host.addEventListener("click", handleGameClick);
  host.dataset.cxGameListener = "1";
}

}

function boot() {
connectGamePage();

// Also supports navigation buttons if switchPage is not globally exposed.
document.addEventListener("click", event => {
  const nav = event.target.closest(".nav-link");
  if (!nav) return;
  const label = (nav.innerText || nav.textContent || "").trim().toLowerCase();
  if (label.includes("game")) {
    window.setTimeout(gamePage, 0);
  }
});
startTimer();

}

if (document.readyState === “loading”) {
document.addEventListener(“DOMContentLoaded”, boot);
} else {
boot();
}
})();