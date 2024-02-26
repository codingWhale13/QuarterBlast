// html elements
const BUTTON_NAME = "startOrAbortButton";
const REMAINING_TIME = "remainingTime";
const AUTO_START_CHECKBOX = "autoStartCheckbox";

// UI
const QB_ALARM_TITLE = "Quarter Blasted";
const IDLE_TEXT = "Let's blast a quarter!";
const BUTTON_START = "Start";
const BUTTON_ABORT = "Abort";

const QUARTER_LABEL = "quarterLabel"; // used for both the input field ID and the key in browser storage

function pad(value) {
    return String(value).padStart(2, "0");
}

async function quarterIsRunning() {
    return (await browser.alarms.get(QB_ALARM_TITLE)) || false;
}

document.addEventListener("DOMContentLoaded", async function () {
    // TIMER
    function updateRemainingTime() {
        displayText = IDLE_TEXT;
        browser.alarms.get(QB_ALARM_TITLE).then(function (alarm) {
            if (alarm) {
                const remainingSec = (alarm.scheduledTime - Date.now()) / 1000;
                if (remainingSec >= 0) {
                    const min = Math.floor(remainingSec / 60);
                    const sec = Math.floor(remainingSec % 60);
                    displayText = `Remaining time: ${pad(min)}:${pad(sec)}`;
                }
            }
            document.getElementById(REMAINING_TIME).textContent = displayText;
        });
    }
    updateRemainingTime(); // show what's up immediately
    setInterval(updateRemainingTime, 1000); // show seconds ticking away

    // AUTO START OPTION
    const result = await browser.storage.local.get("autoStart");
    document.getElementById(AUTO_START_CHECKBOX).checked =
        result.autoStart || false;
    document
        .getElementById(AUTO_START_CHECKBOX)
        .addEventListener("change", async function () {
            await browser.storage.local.set({
                autoStart: this.checked,
            });
        });

    // START-ABORT BUTTON
    btn = document.getElementById(BUTTON_NAME);
    btn.textContent = (await quarterIsRunning()) ? BUTTON_ABORT : BUTTON_START;
    btn.addEventListener("click", async function () {
        if (await quarterIsRunning()) {
            // abort running quarter
            browser.alarms.clear(QB_ALARM_TITLE);
            this.textContent = BUTTON_START;
        } else {
            // start new quarter
            browser.alarms.create(QB_ALARM_TITLE, {
                delayInMinutes: 15,
            });
            window.close();
        }
    });

    // QUARTER LABEL
    quarterLabel = document.getElementById(QUARTER_LABEL);
    quarterLabel.value =
        (await browser.storage.local.get(QUARTER_LABEL))[QUARTER_LABEL] || "";
    quarterLabel.addEventListener("input", async function () {
        await browser.storage.local.set({
            [QUARTER_LABEL]: quarterLabel.value,
        });
    });

    // HISTORY
    document
        .getElementById("historyButton")
        .addEventListener("click", function () {
            browser.tabs.create({ url: "history.html" });
            window.close();
        });
});
