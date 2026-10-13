/* =========================================
CHUBBYX — GAME.JS
NORMAL 24H + FREE UNLIMITED VIP + BACK
========================================= */
(() => {
“use strict”;

const NORMAL_PRIZES = [0, 5000, 5000, 10000, 10000, 15000];
const VIP_PRIZES = [25000, 25000, 50000, 50000, 75000, 100000];
const NORMAL_COOLDOWN = 24 * 60 * 60 * 1000;

const KEYS = {
normalLast: “chubbyx_normal_spin_last”,
coins: “chubby_coins”
};

let activeWheel = “normal”;
let spinning = false;
let normalRotation = 0;
let vipRotation = 0;
let timerStarted = false;

function getCoins() {
return Math.max(0, Number(localStorage.getItem(KEYS.coins)) || 0);
}

function formatCoins(value) {
return Number(value).toLocaleString(“en-US”);
}

function getNormalRemaining() {
const last = Number(localStorage.getItem(KEYS.normalLast)) || 0;
return Math.max(0, NORMAL_COOLDOWN - (Date.now() - last));
}

function formatTime(ms) {
const total = Math.ceil(ms / 1000);
const hours = Math.floor(total / 3600);
const minutes = Math.floor((total % 3600) / 60);
const seconds = total % 60;

return (
  String(hours).padStart(2, "0") + ":" +
  String(minutes).padStart(2, "0") + ":" +
  String(seconds).padStart(2, "0")
);

}

function wheelSVG(prizes, type) {
const colors = [
“#f5d76e”, “#b77b15”, “#ffe9a0”,
“#d49a27”, “#fff0b5”, “#a96808”
];

const cx = 150;
const cy = 150;
const radius = 136;
const step = 360 / prizes.length;
function point(angle, distance) {
  const radians = (angle - 90) * Math.PI / 180;
  return {
    x: cx + distance * Math.cos(radians),
    y: cy + distance * Math.sin(radians)
  };
}
const sectors = prizes.map((prize, index) => {
  const start = point(index * step, radius);
  const end = point((index + 1) * step, radius);
  const middle = index * step + step / 2;
  const label = point(middle, 91);
  return `
    <path
      d="M ${cx} ${cy}
         L ${start.x} ${start.y}
         A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}
         Z"
      fill="${colors[index]}"
      stroke="#6f4208"
      stroke-width="2"
    />
    <text
      x="${label.x}"
      y="${label.y}"
      transform="rotate(${middle}, ${label.x}, ${label.y})"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="#281704"
      font-size="${prize >= 100000 ? 12 : 14}"
      font-weight="900"
    >${formatCoins(prize)}</text>
  `;
}).join("");
return `
  <div class="cx-wheel-frame">
    <div class="cx-pointer"></div>
    <svg
      id="cx-wheel-${type}"
      class="cx-wheel-svg"
      viewBox="0 0 300 300"
      role="img"
      aria-label="${type === "normal" ? "Normal" : "VIP"} prize wheel"
    >
      <circle cx="150" cy="150" r="148" fill="#4b2b06"/>
      <circle cx="150" cy="150" r="142" fill="#f6d36d"/>
      <g class="cx-wheel-rotor">${sectors}</g>
      <circle cx="150" cy="150" r="39"
        fill="#301b07" stroke="#ffdf76" stroke-width="5"/>
      <circle cx="150" cy="150" r="32"
        fill="#6c430e" stroke="#fff0b5" stroke-width="1.5"/>
      <text x="150" y="146" text-anchor="middle"
        fill="#ffdf76" font-size="11" font-weight="900">ChubbyX</text>
      <text x="150" y="161" text-anchor="middle"
        fill="#ffffff" font-size="8" font-weight="700">
        ${type === "normal" ? "NORMAL" : "VIP SPIN"}
      </text>
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
  #games-page .cx-back-btn {
    display: block;
    width: 100%;
    max-width: 420px;
    margin: 0 auto 14px;
    padding: 11px 14px;
    border: 1px solid #9b711f;
    border-radius: 12px;
    background: #211832;
    color: #ffe18a;
    font-size: 15px;
    font-weight: 900;
    text-align: left;
    cursor: pointer;
  }
  #games-page .cx-game-title {
    margin: 5px 0;
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
    background: linear-gradient(135deg, #fff0b1, #dba52e);
    border-color: #ffe69a;
  }
  #games-page .cx-prize-card {
    max-width: 420px;
    margin: 0 auto;
    padding: 16px 10px 20px;
    border: 1px solid #71501d;
    border-radius: 22px;
    background: linear-gradient(180deg, #211832, #151020);
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
    overflow-wrap: anywhere;
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
    background: linear-gradient(135deg, #fff0b1, #e0ad39, #b97b12);
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
    font-size: 15px;
    line-height: 1.5;
    font-weight: 900;
  }
  #games-page .cx-vip-note {
    color: #ffcf80;
    font-size: 11px;
    line-height: 1.6;
    margin: 12px auto 0;
    max-width: 350px;
  }
`;
document.head.appendChild(style);

}

function gamePage() {
const host = document.getElementById(“games-page”);
if (!host) return;

injectStyles();
const prizes = activeWheel === "normal" ? NORMAL_PRIZES : VIP_PRIZES;
host.innerHTML = `
  <section class="cx-game">
    <button type="button" class="cx-back-btn" id="cx-game-back">
      ← Back to Home
    </button>
    <h1 class="cx-game-title">ChubbyX</h1>
    <div class="cx-game-subtitle">SPIN • WIN • HAVE FUN</div>
    <div class="cx-tabs">
      <button type="button"
        class="cx-tab ${activeWheel === "normal" ? "active" : ""}"
        data-wheel="normal">🟡 NORMAL SPIN</button>
      <button type="button"
        class="cx-tab ${activeWheel === "vip" ? "active" : ""}"
        data-wheel="vip">👑 VIP SPIN</button>
    </div>
    <div class="cx-prize-card">
      <div class="cx-balance">
        🪙 Balance:
        <span id="cx-game-balance">${formatCoins(getCoins())}</span>
        ChubbyX
      </div>
      ${wheelSVG(prizes, activeWheel)}
      <div class="cx-info" id="cx-game-info"></div>
      <button type="button" class="cx-spin-btn" id="cx-spin-button">
        SPIN NOW
      </button>
      <div class="cx-result" id="cx-spin-result"></div>
    </div>
    <div class="cx-vip-note" id="cx-vip-note"></div>
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
const note = document.getElementById("cx-vip-note");
const balance = document.getElementById("cx-game-balance");
host.querySelectorAll(".cx-tab").forEach(tab => {
  tab.classList.toggle("active", tab.dataset.wheel === activeWheel);
});
if (normal) {
  const remaining = getNormalRemaining();
  info.textContent = remaining > 0
    ? "Next free spin in " + formatTime(remaining)
    : "One free spin every 24 hours.";
  btn.textContent = remaining > 0
    ? "WAIT " + formatTime(remaining)
    : "🎡 SPIN NOW";
  btn.disabled = spinning || remaining > 0;
  note.textContent =
    "Normal Spin: one free spin every 24 hours. Rewards are demo rewards stored on this device.";
} else {
  info.textContent =
    "VIP rewards: 25,000 • 50,000 • 75,000 • 100,000";
  btn.textContent = "👑 VIP SPIN — FREE DEMO";
  btn.disabled = spinning;
  note.textContent =
    "VIP Spin is free in this demo. No TON or payment is required.";
}
if (balance) balance.textContent = formatCoins(getCoins());

}

function showResult(message) {
const result = document.getElementById(“cx-spin-result”);
if (!result) return;

result.textContent = message;
result.style.display = "block";

}

function spinWheel() {
if (spinning) return;

const type = activeWheel;
const prizes = type === "normal" ? NORMAL_PRIZES : VIP_PRIZES;
if (type === "normal" && getNormalRemaining() > 0) {
  updateGameUI();
  return;
}
spinning = true;
const btn = document.getElementById("cx-spin-button");
if (btn) {
  btn.disabled = true;
  btn.textContent = "SPINNING...";
}
const chosenIndex = Math.floor(Math.random() * prizes.length);
const prize = prizes[chosenIndex];
const svg = document.getElementById("cx-wheel-" + type);
const rotor = svg && svg.querySelector(".cx-wheel-rotor");
const sector = 360 / prizes.length;
const targetAngle = 360 - (chosenIndex * sector + sector / 2);
if (type === "normal") {
  normalRotation += 360 * 6 + targetAngle;
} else {
  vipRotation += 360 * 6 + targetAngle;
}
const rotation = type === "normal" ? normalRotation : vipRotation;
if (rotor) {
  rotor.style.transition =
    "transform 4.5s cubic-bezier(0.12, 0.72, 0.12, 1)";
  rotor.style.transform = "rotate(" + rotation + "deg)";
}
window.setTimeout(() => {
  if (type === "normal") {
    localStorage.setItem(KEYS.normalLast, String(Date.now()));
  }
  // Demo rewards only; not verified by a server.
  if (prize > 0) {
    localStorage.setItem(
      KEYS.coins,
      String(getCoins() + prize)
    );
  }
  spinning = false;
  if (prize === 0) {
    showResult("😅 No prize this time!");
  } else {
    showResult(
      "🎉 You won " + formatCoins(prize) + " ChubbyX! (Demo reward)"
    );
  }
  updateGameUI();
}, 4700);

}

function handleGameClick(event) {
const back = event.target.closest(”#cx-game-back”);

if (back) {
  if (typeof window.switchPage === "function") {
    window.switchPage("home");
  }
  return;
}
const tab = event.target.closest("[data-wheel]");
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
if (timerStarted) return;
timerStarted = true;

window.setInterval(() => {
  if (document.querySelector("#games-page .cx-game")) {
    updateGameUI();
  }
}, 1000);

}

function connectGamePage() {
const host = document.getElementById(“games-page”);

if (host && !host.dataset.cxGameListener) {
  host.addEventListener("click", handleGameClick);
  host.dataset.cxGameListener = "1";
}
const originalSwitchPage = window.switchPage;
if (
  typeof originalSwitchPage === "function" &&
  !originalSwitchPage.__cxGameWrapped
) {
  const wrapped = function(pageId, element) {
    const result = originalSwitchPage.apply(this, arguments);
    if (pageId === "games") {
      gamePage();
    }
    return result;
  };
  wrapped.__cxGameWrapped = true;
  window.switchPage = wrapped;
}
document.addEventListener("click", event => {
  const nav = event.target.closest(".nav-link");
  if (!nav) return;
  const label = (nav.innerText || nav.textContent || "")
    .trim()
    .toLowerCase();
  if (label.includes("game")) {
    window.setTimeout(gamePage, 0);
  }
});
startTimer();

}

window.gamePage = gamePage;
window.renderGame = gamePage;

if (document.readyState === “loading”) {
document.addEventListener(“DOMContentLoaded”, connectGamePage);
} else {
connectGamePage();
}
})();