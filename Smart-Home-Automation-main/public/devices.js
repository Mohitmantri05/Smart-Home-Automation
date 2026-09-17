// ==================== CHECK SESSION ====================

async function checkSession() {

    const response = await fetch("/api/session");

    const data = await response.json();

    if (!data.loggedIn) {

        window.location.href = "login.html";
        return;

    }

}

checkSession();


// ==================== LOGOUT ====================

async function logout() {

    await fetch("/api/logout", {

        method: "POST"

    });

    window.location.href = "login.html";

}


// ==================== LOAD DEVICES ====================

let allDevices = [];

async function loadDevices() {

    const response = await fetch("/api/devices");

    allDevices = await response.json();

    renderDevices(allDevices);

}
// ==================== ADD DEVICE ====================

async function addDevice() {

    const name = document.getElementById("deviceName").value.trim();

    const type = document.getElementById("deviceType").value.trim();

    const room = document.getElementById("deviceRoom").value.trim();

    const status = document.getElementById("deviceStatus").value;

    if (name === "" || type === "" || room === "") {

        alert("Please fill all fields");

        return;

    }

    const duplicate = allDevices.find(device =>

        device.name.toLowerCase() === name.toLowerCase() &&
        device.room.toLowerCase() === room.toLowerCase()

    );

    if (duplicate) {

        alert("Device already exists.");

        return;

    }

    const response = await fetch("/api/devices", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name,
            type,
            room,
            status

        })

    });

    const data = await response.json();

    alert(data.message);

    document.getElementById("deviceName").value = "";
    document.getElementById("deviceType").value = "";
    document.getElementById("deviceRoom").value = "";
    document.getElementById("deviceStatus").value = "ON";

    loadDevices();

}


// ==================== DELETE DEVICE ====================

async function deleteDevice(id) {

    if (!confirm("Delete this device?")) {

        return;

    }

    const response = await fetch("/api/devices/" + id, {

        method: "DELETE"

    });

    const data = await response.json();

    alert(data.message);

    loadDevices();

}


// ==================== EDIT DEVICE ====================

async function editDevice(id) {

    const device = allDevices.find(d => d.id === id);

    if (!device) {

        alert("Device not found");

        return;

    }

    const newName = prompt("Device Name", device.name);

    if (newName === null) return;

    const newType = prompt("Device Type", device.type);

    if (newType === null) return;

    const newRoom = prompt("Room", device.room);

    if (newRoom === null) return;

    const newStatus = prompt("Status (ON/OFF)", device.status);

    if (newStatus === null) return;

    const response = await fetch("/api/devices/" + id, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name: newName.trim(),

            type: newType.trim(),

            room: newRoom.trim(),

            status: newStatus.toUpperCase()

        })

    });

    const data = await response.json();

    alert(data.message);

    loadDevices();

}


// ==================== INITIAL LOAD ====================

loadDevices();
function applyTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark-mode");

    }else{

        document.body.classList.remove("dark-mode");

    }

}

applyTheme();
function searchDevices(){

    const text = document.getElementById("searchDevice").value.toLowerCase();

    const status = document.getElementById("filterStatus").value;


    let filtered = allDevices;

    if(text !== ""){

        filtered = filtered.filter(device=>

            device.name.toLowerCase().includes(text) ||

            device.type.toLowerCase().includes(text) ||

            device.room.toLowerCase().includes(text)

        );

    }

    if(status !== "ALL"){

        filtered = filtered.filter(device=>

            device.status === status

        );

    }

    renderDevices(filtered);

}



function filterDevices(){

    searchDevices();

}



function renderDevices(list){

    const table = document.querySelector("#deviceTable tbody");

    table.innerHTML = "";

    list.forEach(device => {

        // Device emoji based on device type
        let deviceEmoji = "🔌";

        const type = device.type.toLowerCase();

        if (type.includes("light") || type.includes("lamp") || type.includes("bulb")) {
            deviceEmoji = "💡";
        }
        else if (type.includes("fan")) {
            deviceEmoji = "🌀";
        }
        else if (type.includes("ac") || type.includes("air conditioner")) {
            deviceEmoji = "❄️";
        }
        else if (type.includes("tv") || type.includes("television")) {
            deviceEmoji = "📺";
        }
        else if (type.includes("camera")) {
            deviceEmoji = "📷";
        }
        else if (type.includes("door")) {
            deviceEmoji = "🚪";
        }
        else if (type.includes("lock")) {
            deviceEmoji = "🔐";
        }
        else if (type.includes("sensor")) {
            deviceEmoji = "📡";
        }
        else if (type.includes("heater")) {
            deviceEmoji = "🔥";
        }
        else if (type.includes("water")) {
            deviceEmoji = "💧";
        }
        else if (type.includes("refrigerator") || type.includes("fridge")) {
            deviceEmoji = "🧊";
        }

        // Status style
        const statusClass =
            device.status === "ON" ? "device-on" : "device-off";

        table.innerHTML += `
            <tr>

                <td>${device.id}</td>

                <td class="device-name-cell">
                    <span class="device-emoji">${deviceEmoji}</span>
                    <strong>${device.name}</strong>
                </td>

                <td>${device.type}</td>

                <td>🏠 ${device.room}</td>

                <td>
                    <span class="device-status ${statusClass}">
                        ${device.status === "ON" ? "🟢 ON" : "🔴 OFF"}
                    </span>
                </td>

                <td>

                    <button onclick="editDevice(${device.id})">
                        ✏️ Edit
                    </button>

                    <button onclick="deleteDevice(${device.id})">
                        🗑️ Delete
                    </button>

                </td>

            </tr>
        `;
    });
}