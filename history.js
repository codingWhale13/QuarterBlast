const BLASTED_QUARTERS = "blastedQuarters";

document.addEventListener("DOMContentLoaded", async function () {
    blastedQuarters =
        (await browser.storage.local.get(BLASTED_QUARTERS))[BLASTED_QUARTERS] ||
        [];
    summary = `Blasted quarters in total: ${blastedQuarters.length}`;
    document.getElementById("summary").textContent = summary;

    // separate blasted quarters by date
    quartersByDay = {};
    blastedQuarters.forEach(function (quarter) {
        quarterLabel = quarter[0];
        timeOfBlast = quarter[1];

        dateOfBlast = new Date(timeOfBlast).toLocaleDateString("en-CA", {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // use client's timezone
        });

        if (!(dateOfBlast in quartersByDay)) quartersByDay[dateOfBlast] = [];
        quartersByDay[dateOfBlast].push(quarterLabel);
    });

    // create HTML elements to display history
    const quarterHistory = document.getElementById("quarterHistory");
    for (const [blastDate, quarterLabels] of Object.entries(quartersByDay)) {
        const heading = document.createElement("h2");
        heading.textContent = blastDate;

        const counts = {};
        quarterLabels.forEach((label) => {
            counts[label] = (counts[label] || 0) + 1;
        });

        dailyList = document.createElement("ul");
        for (const [label, amount] of Object.entries(counts)) {
            const listItem = document.createElement("li");
            listItem.textContent = amount == 1 ? label : `${label} (${amount})`;
            dailyList.appendChild(listItem);
        }

        quarterHistory.appendChild(heading);
        quarterHistory.appendChild(dailyList);
    }
});
