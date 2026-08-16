// ==========================================
// AVALERT - OFFLINE + ALERT MODULE
// ==========================================


// Get elements from HTML
const networkStatus = document.getElementById("networkStatus");
const sosButton = document.getElementById("sosButton");
const sosMessage = document.getElementById("sosMessage");

const queueCount = document.getElementById("queueCount");
const queueList = document.getElementById("queueList");

const syncButton = document.getElementById("syncButton");


// ==========================================
// LOCAL SOS QUEUE
// ==========================================

let sosQueue = JSON.parse(
    localStorage.getItem("avalertSOSQueue")
) || [];


// ==========================================
// NETWORK STATUS
// ==========================================

function updateNetworkStatus() {

    if (navigator.onLine) {

        networkStatus.textContent = "🟢 Online";

        networkStatus.className = "online";

    } else {

        networkStatus.textContent = "🔴 Offline";

        networkStatus.className = "offline";
    }
}


// Detect network changes

window.addEventListener("online", function () {

    updateNetworkStatus();

    sosMessage.textContent =
        "Internet restored. Attempting to send queued SOS...";

    syncQueue();

});


window.addEventListener("offline", function () {

    updateNetworkStatus();

    sosMessage.textContent =
        "You are offline. SOS will be stored locally.";

});


// ==========================================
// SEND SOS
// ==========================================

sosButton.addEventListener("click", function () {

    const sos = {

        id: Date.now(),

        type: "SOS",

        message: "Emergency SOS received",

        time: new Date().toLocaleString(),

        status: navigator.onLine
            ? "Ready to send"
            : "Queued - Offline"

    };


    if (navigator.onLine) {

        sendSOS(sos);

    } else {

        sosQueue.push(sos);

        saveQueue();

        sosMessage.textContent =
            "📦 SOS saved locally because you are offline.";

        updateQueueDisplay();
    }

});


// ==========================================
// SEND SOS TO SERVER (SIMULATION)
// ==========================================

function sendSOS(sos) {

    console.log("Sending SOS:", sos);

    sosMessage.textContent =
        "✅ SOS sent successfully!";

}


// ==========================================
// SAVE QUEUE
// ==========================================

function saveQueue() {

    localStorage.setItem(
        "avalertSOSQueue",
        JSON.stringify(sosQueue)
    );

}


// ==========================================
// DISPLAY QUEUE
// ==========================================

function updateQueueDisplay() {

    queueCount.textContent = sosQueue.length;

    queueList.innerHTML = "";


    sosQueue.forEach(function (sos) {

        const item = document.createElement("div");

        item.className = "queue-item";

        item.innerHTML = `
            <strong>🆘 SOS</strong><br>
            Time: ${sos.time}<br>
            Status: ${sos.status}
        `;

        queueList.appendChild(item);

    });

}


// ==========================================
// STORE AND FORWARD
// ==========================================

function syncQueue() {

    if (!navigator.onLine) {

        sosMessage.textContent =
            "🔴 Still offline. SOS queue cannot be sent.";

        return;

    }


    if (sosQueue.length === 0) {

        sosMessage.textContent =
            "✅ No SOS messages waiting.";

        return;

    }


    console.log(
        "Sending queued SOS messages..."
    );


    sosQueue.forEach(function (sos) {

        sendSOS(sos);

    });


    // Clear queue after successful simulation

    sosQueue = [];

    saveQueue();

    updateQueueDisplay();


    sosMessage.textContent =
        "✅ All queued SOS messages forwarded successfully.";

}


// ==========================================
// SYNC BUTTON
// ==========================================

syncButton.addEventListener(
    "click",
    syncQueue
);


// ==========================================
// COMMUNITY ALERT VERIFICATION
// ==========================================

function verifyAlert(button) {

    const verification =
        button.parentElement.querySelector(
            ".verification"
        );


    verification.textContent =
        "✅ Verified by community";


    verification.style.color =
        "green";


    button.textContent =
        "Verified";


    button.disabled = true;


    console.log(
        "Community alert verified."
    );

}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

updateNetworkStatus();

updateQueueDisplay();