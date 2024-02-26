const QB_ALARM_TITLE = "Quarter Blasted";

const QUARTER_LABEL = "quarterLabel";
const BLASTED_QUARTERS = "blastedQuarters";

const MESSAGE = "Hooray!";
const SOUND_PATH = "assets/sounds/radio-cuba-cue_03-106715.mp3"; //https://pixabay.com/sound-effects/radio-cuba-cue-03-106715/
const AUDIO = new Audio(SOUND_PATH);

async function saveBlastedQuarter() {
    quarterLabel =
        (await browser.storage.local.get(QUARTER_LABEL))[QUARTER_LABEL] || "";
    const timeOfBlast = new Date().toISOString(); // using UTC time

    blastedQuarters =
        (await browser.storage.local.get(BLASTED_QUARTERS))[BLASTED_QUARTERS] ||
        [];

    blastedQuarters.push([quarterLabel, timeOfBlast]);
    browser.storage.local.set({ [BLASTED_QUARTERS]: blastedQuarters });
}

browser.alarms.onAlarm.addListener(async function (alarmInfo) {
    saveBlastedQuarter();

    // notify user about end of quarter
    browser.notifications.create({
        type: "basic",
        title: alarmInfo.name,
        message: MESSAGE,
    });
    AUDIO.play();

    // start next quarter if autoStart is enabled
    autoStartEnabled =
        (await browser.storage.local.get("autoStart")).autoStart || false;
    if (autoStartEnabled)
        browser.alarms.create(QB_ALARM_TITLE, { delayInMinutes: 15 });
});
