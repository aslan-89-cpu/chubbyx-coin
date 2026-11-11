/* =========================================
   CHUBBYX — ADS (AdsGram)
   Interstitial + Rewarded ads
   Safe: does nothing until block IDs are set
========================================= */
(function () {
    "use strict";

    // 1) Create an account at https://partner.adsgram.ai
    // 2) Add your Mini App, create two blocks, then paste the IDs here.
    const INTERSTITIAL_BLOCK_ID = "int-XXXXX"; // example: "int-12345"
    const REWARDED_BLOCK_ID     = "XXXXX";     // example: "12346"

    // Keep ads gentle so users do not leave
    const MIN_GAP_MS = 90 * 1000;   // at least 90s between auto ads
    const MAX_PER_SESSION = 8;      // max auto ads per visit

    let lastShown = 0;
    let shownCount = 0;
    let showing = false;
    const controllers = {};

    function isReal(id) {
        return typeof id === "string" && id.length > 0 && !/X{3,}/.test(id);
    }

    function getController(kind) {
        if (controllers[kind]) return controllers[kind];
        if (!window.Adsgram) return null;

        const id = kind === "rewarded" ? REWARDED_BLOCK_ID : INTERSTITIAL_BLOCK_ID;
        if (!isReal(id)) return null;

        try {
            controllers[kind] = window.Adsgram.init({ blockId: id });
            return controllers[kind];
        } catch (error) {
            console.warn("ChubbyX ads init failed:", error);
            return null;
        }
    }

    // Automatic ad at natural pauses (after a game, spin, check-in...)
    window.cxAd = async function (placement) {
        if (showing) return false;
        if (shownCount >= MAX_PER_SESSION) return false;
        if (Date.now() - lastShown < MIN_GAP_MS) return false;

        const controller = getController("interstitial");
        if (!controller) return false;

        showing = true;
        try {
            await controller.show();
            shownCount++;
            lastShown = Date.now();
            return true;
        } catch (error) {
            // no ad available or user error: do nothing
            return false;
        } finally {
            showing = false;
        }
    };

    // Ad the user chooses to watch (button)
    window.cxRewardedAd = async function () {
        if (showing) return false;

        const controller = getController("rewarded");
        if (!controller) return false;

        showing = true;
        try {
            await controller.show();
            return true; // watched till the end
        } catch (error) {
            return false;
        } finally {
            showing = false;
        }
    };
})();
