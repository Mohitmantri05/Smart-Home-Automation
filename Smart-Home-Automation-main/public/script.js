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


// ==================== ELEMENTS ====================

const lightStatus = document.getElementById("lightStatus");
const fanStatus = document.getElementById("fanStatus");
const temperature = document.getElementById("temperature");
const waterTank = document.getElementById("waterTank");
const deviceCount = document.getElementById("deviceCount");
const activeDevices = document.getElementById("activeDevices");

document.getElementById("lightOn").addEventListener("click", turnLightOn);
document.getElementById("lightOff").addEventListener("click", turnLightOff);
document.getElementById("fanOn").addEventListener("click", turnFanOn);
document.getElementById("fanOff").addEventListener("click", turnFanOff);


// ==================== LIGHT ====================

async function turnLightOn() {

    const response = await fetch("/api/light/on", {

        method: "POST"

    });

    const data = await response.json();

    alert(data.message);

    loadStatus();

}

async function turnLightOff() {

    const response = await fetch("/api/light/off", {

        method: "POST"

    });

    const data = await response.json();

    alert(data.message);

    loadStatus();

}


// ==================== FAN ====================

async function turnFanOn() {

    const response = await fetch("/api/fan/on", {

        method: "POST"

    });

    const data = await response.json();

    alert(data.message);

    loadStatus();

}

async function turnFanOff() {

    const response = await fetch("/api/fan/off", {

        method: "POST"

    });

    const data = await response.json();

    alert(data.message);

    loadStatus();

}


// ==================== DASHBOARD STATUS ====================

async function loadStatus() {

    const response = await fetch("/api/status");

    const data = await response.json();

    lightStatus.innerHTML = "Status : " + data.light;

    fanStatus.innerHTML = "Status : " + data.fan;

    temperature.innerHTML = data.temperature + "°C";

    waterTank.innerHTML = data.waterTank + "%";
// Total Devices
    document.getElementById("deviceCount").innerHTML = data.devices.length;

// Active Devices
    const activeDevices = data.devices.filter(device => device.status === "ON").length;

    document.getElementById("activeDevices").innerHTML = activeDevices;

// Offline Devices
    document.getElementById("offlineDevices").innerHTML =
    data.devices.length - activeDevices;

// Energy Usage
    const energyUsage = activeDevices * 1.5;

    document.getElementById("energyUsage").innerHTML =
    energyUsage.toFixed(1) + " kWh";
}


// ==================== DEVICE STATISTICS ====================

async function loadDeviceStatistics() {

    const response = await fetch("/api/devices");

    const devices = await response.json();

    deviceCount.innerHTML = devices.length;

    let active = 0;

    devices.forEach(device => {

        if (device.status.toUpperCase() === "ON") {

            active++;

        }

    });

    activeDevices.innerHTML = active;

}


// ==================== UPDATE TEMPERATURE ====================

async function updateTemperature() {

    const value = prompt("Enter Temperature");

    if (value === null || value === "") {

        return;

    }

    await fetch("/api/temperature/" + value, {

        method: "POST"

    });

    loadStatus();

}


// ==================== UPDATE WATER TANK ====================

async function updateWaterTank() {

    const value = prompt("Enter Water Tank Percentage");

    if (value === null || value === "") {

        return;

    }

    await fetch("/api/waterTank/" + value, {

        method: "POST"

    });

    loadStatus();

}


// ==================== CLOCK ====================

function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString();

}

setInterval(updateClock, 1000);

updateClock();


// ==================== DATE ====================

function updateDate() {

    const today = new Date();

    document.getElementById("date").innerHTML =
        today.toDateString();

}

updateDate();


// ==================== AUTO REFRESH ====================

// ==================== AUTO REFRESH ====================

loadStatus();

loadDeviceStatistics();

loadDashboardStats();

loadCharts();

loadRoomChart();

loadTypeChart();

loadRecentActivity();

loadWeather();

loadSystemHealth();

loadDeviceSelector();

filterDashboardDevices();

loadRoomSummary();

loadDeviceUsage();

loadDeviceHealth();

loadMostActiveDevice();
setInterval(() => {

    loadStatus();

    loadDeviceStatistics();

    loadDashboardStats();

    loadCharts();

    loadRoomChart();

    loadTypeChart();

    loadRecentActivity();

    loadWeather();

    loadSystemHealth();

    loadDeviceSelector();

    filterDashboardDevices();

    loadRoomSummary();

    loadDeviceUsage();

    loadDeviceHealth();

    loadMostActiveDevice();
},5000);
function applyTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark-mode");

    }else{

        document.body.classList.remove("dark-mode");

    }

}

applyTheme();
async function loadDashboardStats(){

    const response = await fetch("/api/status");

    const data = await response.json();

    document.getElementById("totalLogs").innerHTML = data.logs.length;

    document.getElementById("notificationCount").innerHTML = data.notifications.length;

    const offline = data.devices.filter(device => device.status === "OFF").length;

    document.getElementById("offlineDevices").innerHTML = offline;

    const usage = (data.devices.length * 2.4).toFixed(1);

    document.getElementById("energyUsage").innerHTML = usage + " kWh";

}
let deviceChart;
let summaryChart;
let deviceManagementChart;

async function loadCharts() {

    try {

        const response = await fetch("/api/status");
        const data = await response.json();

        const devices = data.devices || [];
        const logs = data.logs || [];
        const notifications = data.notifications || [];

        const active = devices.filter(
            device => device.status === "ON"
        ).length;

        const offline = devices.length - active;

        // ==================== DEVICE STATUS CHART ====================

        const deviceCanvas = document.getElementById("deviceChart");

        if (deviceCanvas) {

            if (deviceChart) {
                deviceChart.destroy();
            }

            deviceChart = new Chart(deviceCanvas, {

                type: "doughnut",

                data: {
                    labels: ["Active", "Offline"],

                    datasets: [{
                        data: [active, offline],

                        backgroundColor: [
                            "#22c55e",
                            "#ef4444"
                        ],

                        borderWidth: 3,
                        borderColor: "#ffffff"
                    }]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            position: "bottom",

                            labels: {
                                color: "#ffffff",
                                padding: 15,
                                font: {
                                    size: 14
                                }
                            }
                        }
                    }
                }

            });
        }


        // ==================== DASHBOARD SUMMARY CHART ====================

        const summaryCanvas =
            document.getElementById("summaryChart");

        if (summaryCanvas) {

            if (summaryChart) {
                summaryChart.destroy();
            }

            summaryChart = new Chart(summaryCanvas, {

                type: "bar",

                data: {

                    labels: [
                        "Devices",
                        "Logs",
                        "Notifications"
                    ],

                    datasets: [{
                        label: "HomeSphere",

                        data: [
                            devices.length,
                            logs.length,
                            notifications.length
                        ],

                        backgroundColor: [
                            "#3b82f6",
                            "#22c55e",
                            "#f59e0b"
                        ],

                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },

                options: {

                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            display: false
                        }
                    },

                    scales: {

                        x: {
                            ticks: {
                                color: "#ffffff",
                                font: {
                                    weight: "bold"
                                }
                            },

                            grid: {
                                color: "rgba(255,255,255,0.08)"
                            }
                        },

                        y: {
                            beginAtZero: true,

                            ticks: {
                                color: "#ffffff"
                            },

                            grid: {
                                color: "rgba(255,255,255,0.08)"
                            }
                        }
                    }
                }

            });
        }

    }

    catch (error) {

        console.error(
            "Dashboard chart error:",
            error
        );

    }

}
async function loadRecentActivity(){

    const response = await fetch("/api/logs");

    const logs = await response.json();

    const table = document.getElementById("recentActivity");

    table.innerHTML = "";

    logs.reverse().slice(0,5).forEach(log=>{

        table.innerHTML += `

        <tr>

            <td>${log.activity}</td>

            <td>${log.time}</td>

        </tr>

        `;

    });

}

async function searchDashboardDevice(){

    const keyword = document.getElementById("dashboardSearch").value.toLowerCase();

    const response = await fetch("/api/devices");

    const devices = await response.json();

    const result = document.getElementById("dashboardSearchResult");

    if(keyword===""){

        document.getElementById("searchStats").innerHTML="";

        result.innerHTML="";

        return;

    }

    const filtered = devices.filter(device=>

        device.name.toLowerCase().includes(keyword) ||

        device.type.toLowerCase().includes(keyword) ||

        device.room.toLowerCase().includes(keyword)

    );

    if(filtered.length===0){

        document.getElementById("searchStats").innerHTML="Found 0 device(s)";

        result.innerHTML="<p>No Device Found</p>";

        return;

    }

    result.innerHTML="";
    document.getElementById("searchStats").innerHTML =
    "Found " + filtered.length + " device(s)";

    filtered.forEach(device=>{

        result.innerHTML+=`

        <div class="card" style="margin-top:10px">

            <h3>${device.name}</h3>

            <p>Type : ${device.type}</p>

            <p>Room : ${device.room}</p>

            <p>Status : ${device.status}</p>

        </div>

        `;

    });

}
async function loadWeather(){

    try{

        const response = await fetch("https://wttr.in/?format=j1");

        const data = await response.json();

        document.getElementById("weatherTemp").innerHTML =
        data.current_condition[0].temp_C + "°C";

        document.getElementById("weatherCity").innerHTML =
        data.nearest_area[0].areaName[0].value;

    }

    catch{

        document.getElementById("weatherCity").innerHTML =
        "Weather Unavailable";

    }

}
let roomChart;

async function loadRoomChart(){

    const response = await fetch("/api/devices");

    const devices = await response.json();

    const rooms = {};

    devices.forEach(device=>{

        rooms[device.room]=(rooms[device.room]||0)+1;

    });

    if(roomChart){

        roomChart.destroy();

    }

    roomChart = new Chart(document.getElementById("roomChart"),{

        type:"pie",

        data:{

            labels:Object.keys(rooms),

            datasets:[{

                data:Object.values(rooms),

                backgroundColor:[

                    "#3b82f6",

                    "#22c55e",

                    "#f59e0b",

                    "#ef4444",

                    "#8b5cf6",

                    "#06b6d4",

                    "#ec4899"

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    labels:{

                        color:"white"

                    }

                }

            }

        }

    });

}
async function loadSystemHealth(){

    document.getElementById("serverStatus").innerHTML="🟢 Online";

    document.getElementById("databaseStatus").innerHTML="🟢 Connected";

    const response=await fetch("/api/status");

    const data=await response.json();

    document.getElementById("deviceHealth").innerHTML=data.devices.length;

    document.getElementById("notificationHealth").innerHTML=data.notifications.length;

}
let uptimeSeconds = 0;

function updateUptime(){

    uptimeSeconds++;

    const hours = String(Math.floor(uptimeSeconds / 3600)).padStart(2,"0");

    const minutes = String(Math.floor((uptimeSeconds % 3600)/60)).padStart(2,"0");

    const seconds = String(uptimeSeconds % 60).padStart(2,"0");

    document.getElementById("uptime").innerHTML =
    hours + ":" + minutes + ":" + seconds;

}

setInterval(updateUptime,1000);
let typeChart;

async function loadTypeChart(){

    const response = await fetch("/api/devices");

    const devices = await response.json();

    const types = {};

    devices.forEach(device=>{

        types[device.type]=(types[device.type]||0)+1;

    });

    if(typeChart){

        typeChart.destroy();

    }

    typeChart=new Chart(document.getElementById("typeChart"),{

        type:"polarArea",

        data:{

            labels:Object.keys(types),

            datasets:[{

                data:Object.values(types),

                backgroundColor:[

                    "#3b82f6",

                    "#22c55e",

                    "#ef4444",

                    "#f59e0b",

                    "#8b5cf6",

                    "#06b6d4",

                    "#ec4899",

                    "#14b8a6"

                ]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    labels:{

                        color:"white"

                    }

                }

            }

        }

    });

}
async function downloadDashboardReport(){

    const response = await fetch("/api/status");

    const data = await response.json();

    let csv = "Category,Value\n";

    csv += "Light," + data.light + "\n";

    csv += "Fan," + data.fan + "\n";

    csv += "Temperature," + data.temperature + "\n";

    csv += "Water Tank," + data.waterTank + "\n";

    csv += "Total Devices," + data.devices.length + "\n";

    csv += "Total Logs," + data.logs.length + "\n";

    csv += "Notifications," + data.notifications.length + "\n";

    const blob = new Blob([csv],{

        type:"text/csv"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Dashboard_Report.csv";

    a.click();

    URL.revokeObjectURL(url);

}
async function loadDeviceSelector(){

    const response = await fetch("/api/devices");

    const devices = await response.json();

    const select = document.getElementById("deviceSelect");

    select.innerHTML = "";

    devices.forEach(device=>{

        select.innerHTML += `
        <option value="${device.id}">
            ${device.name} (${device.status})
        </option>
        `;

    });

}

async function toggleSelectedDevice(){

    const id = document.getElementById("deviceSelect").value;

    const response = await fetch("/api/devices");

    const devices = await response.json();

    const device = devices.find(d=>d.id==id);

    if(!device) return;

    const newStatus = device.status==="ON" ? "OFF" : "ON";

    await fetch("/api/devices/"+id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            ...device,

            status:newStatus

        })

    });

    loadStatus();

    loadCharts();

    loadRoomChart();

    loadTypeChart();

    loadDeviceStatistics();

    loadDashboardStats();

    loadDeviceSelector();

}
async function filterDashboardDevices(){

    const status = document.getElementById("dashboardStatusFilter").value;

    const response = await fetch("/api/devices");

    const devices = await response.json();

    let filtered = devices;

    if(status !== "ALL"){

        filtered = devices.filter(device => device.status === status);

    }

    const container = document.getElementById("dashboardFilteredDevices");

    container.innerHTML = "";

    if(filtered.length === 0){

        container.innerHTML = "<p>No Devices Found</p>";

        return;

    }

    filtered.forEach(device=>{

        container.innerHTML += `
            <div style="padding:10px;border:1px solid #444;border-radius:8px;margin:8px;">
                <b>${device.name}</b><br>
                Type : ${device.type}<br>
                Room : ${device.room}<br>
                Status : ${device.status}
            </div>
        `;

    });

}
async function loadRoomSummary(){

    const response = await fetch("/api/devices");

    const devices = await response.json();

    const rooms = {};

    devices.forEach(device=>{

        rooms[device.room]=(rooms[device.room]||0)+1;

    });

    const table = document.getElementById("roomSummaryTable");

    table.innerHTML="";

    for(const room in rooms){

        table.innerHTML += `
        <tr>
            <td>${room}</td>
            <td>${rooms[room]}</td>
        </tr>
        `;

    }

}
async function loadDeviceUsage() {

    try {

        const response = await fetch("/api/devices");

        if (!response.ok) {
            throw new Error("Failed to load devices");
        }

        const devices = await response.json();

        const canvas = document.getElementById("deviceManagementChart");

        if (!canvas) {
            return;
        }

        // Keep chart size stable so the page does not jump/flicker
        canvas.style.width = "100%";
        canvas.style.height = "420px";

        const labels = devices.map(device => device.name);

        const daily = devices.map(() =>
            Math.floor(Math.random() * 10) + 5
        );

        const weekly = devices.map(() =>
            Math.floor(Math.random() * 30) + 20
        );

        const monthly = devices.map(() =>
            Math.floor(Math.random() * 60) + 40
        );

        // If chart already exists, UPDATE it instead of destroying it
        if (window.deviceManagementGraph) {

            window.deviceManagementGraph.data.labels = labels;

            window.deviceManagementGraph.data.datasets[0].data = daily;
            window.deviceManagementGraph.data.datasets[1].data = weekly;
            window.deviceManagementGraph.data.datasets[2].data = monthly;

            window.deviceManagementGraph.update("none");

            return;
        }

        // Create chart only once
        window.deviceManagementGraph = new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {
                        label: "Daily Usage",

                        data: daily,

                        borderColor: "#22c55e",

                        backgroundColor: "rgba(34,197,94,0.12)",

                        fill: true,

                        tension: 0.35,

                        borderWidth: 3,

                        pointRadius: 5,

                        pointHoverRadius: 8
                    },

                    {
                        label: "Weekly Usage",

                        data: weekly,

                        borderColor: "#f59e0b",

                        backgroundColor: "rgba(245,158,11,0.10)",

                        fill: true,

                        tension: 0.35,

                        borderWidth: 3,

                        pointRadius: 5,

                        pointHoverRadius: 8
                    },

                    {
                        label: "Monthly Usage",

                        data: monthly,

                        borderColor: "#3b82f6",

                        backgroundColor: "rgba(59,130,246,0.10)",

                        fill: true,

                        tension: 0.35,

                        borderWidth: 3,

                        pointRadius: 5,

                        pointHoverRadius: 8
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: true,

                aspectRatio: 2.4,

                animation: false,

                interaction: {

                    mode: "index",

                    intersect: false
                },

                plugins: {

                    legend: {

                        position: "top",

                        labels: {

                            color: "#333",

                            padding: 20,

                            font: {

                                size: 14,

                                weight: "bold"
                            }
                        }
                    },

                    tooltip: {

                        backgroundColor: "#111827",

                        titleColor: "#ffffff",

                        bodyColor: "#ffffff",

                        padding: 12,

                        cornerRadius: 8
                    }
                },

                scales: {

                    x: {

                        ticks: {

                            color: "#333",

                            font: {

                                size: 13,

                                weight: "bold"
                            }
                        },

                        grid: {

                            color: "rgba(0,0,0,0.08)"
                        }
                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            color: "#333"
                        },

                        grid: {

                            color: "rgba(0,0,0,0.08)"
                        }
                    }
                }
            }
        });

    }

    catch (error) {

        console.error("Device Usage Chart Error:", error);

    }
}
async function loadDeviceHealth(){

    const response = await fetch("/api/devices");

    const devices = await response.json();

    const table = document.getElementById("deviceHealthTable");

    table.innerHTML = "";

    devices.forEach(device=>{

        let health;

        let status;

        if(device.status==="ON"){

            health=Math.floor(Math.random()*21)+80;

            status="Excellent";

        }else{

            health=Math.floor(Math.random()*41)+40;

            status="Needs Attention";

        }

        table.innerHTML += `

        <tr>

            <td>${device.name}</td>

            <td>${health}%</td>

            <td>${status}</td>

        </tr>

        `;

    });

}
async function loadMostActiveDevice(){

    const response = await fetch("/api/devices");

    const devices = await response.json();

    let bestDevice = null;

    let bestUsage = -1;

    devices.forEach(device=>{

        const usage =
        device.status==="ON"
        ? Math.floor(Math.random()*41)+60
        : Math.floor(Math.random()*31);

        if(usage > bestUsage){

            bestUsage = usage;

            bestDevice = device;

        }

    });

    if(bestDevice){

        document.getElementById("mostActiveDevice").innerHTML =
        bestDevice.name;

        document.getElementById("mostActiveUsage").innerHTML =
        "Usage : " + bestUsage + "%";
    }

}
// ==================== ELECTRICITY USAGE ====================

async function loadEnergyUsage() {

    try {

        const response = await fetch("/api/energy");

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        const energyElement =
            document.getElementById("energyUsage");

        const currentPowerElement =
            document.getElementById("currentPower");

        const todayElement =
            document.getElementById("todayEnergy");

        const monthElement =
            document.getElementById("monthEnergy");

        const todayCostElement =
            document.getElementById("todayCost");

        const monthCostElement =
            document.getElementById("monthCost");
    
        if (energyElement) {

            energyElement.textContent =
                data.todayKWh + " kWh";

        }


        if (currentPowerElement) {

            currentPowerElement.textContent =
                data.watts + " W";

        }


        if (todayElement) {

            todayElement.textContent =
                data.todayKWh + " kWh";

        }


        if (monthElement) {

            monthElement.textContent =
                data.monthKWh + " kWh";

        }
        if (todayCostElement) {

            todayCostElement.textContent =
                "₹" + data.todayCost.toFixed(2);

        }

        if (monthCostElement) {

            monthCostElement.textContent =
                 "₹" + data.monthCost.toFixed(2);

        }
    } catch (error) {

        console.error(
            "Electricity usage error:",
            error
        );

    }

}
loadEnergyUsage();

setInterval(loadEnergyUsage, 10000);