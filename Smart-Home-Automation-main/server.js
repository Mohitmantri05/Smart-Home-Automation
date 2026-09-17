const express = require("express");
const session = require("express-session");

const app = express();
app.use(express.json());
app.use(session({
    secret: "homesphere_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));
const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const PORT = 3000;

const dbPath = path.join(__dirname, "data", "db.json");
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, {});
// ==================== ELECTRICITY MONITOR ====================

const ELECTRICITY_RATE = 8; // Estimated ₹ per kWh

const DEVICE_POWER = {
    light: 10,
    fan: 75,
    ac: 1200,
    airconditioner: 1200,
    tv: 100,
    television: 100,
    refrigerator: 150,
    fridge: 150,
    heater: 1500,
    washingmachine: 500,
    washing_machine: 500,
    computer: 200,
    laptop: 60,
    bulb: 10
};

function getDevicePower(device) {

    const type = String(device.type || device.name || "")
        .toLowerCase()
        .replace(/\s+/g, "");

    for (const key of Object.keys(DEVICE_POWER)) {

        if (type.includes(key)) {
            return DEVICE_POWER[key];
        }

    }

    // Default estimated power for unknown devices
    return 50;
}


async function updateElectricityUsage() {

    await db.read();

    if (!db.data.energyUsage) {

        db.data.energyUsage = {
            todayWh: 0,
            monthWh: 0,
            lastUpdated: Date.now()
        };

    }

    const now = Date.now();

    const lastUpdated =
        Number(db.data.energyUsage.lastUpdated) || now;

    const elapsedHours =
        (now - lastUpdated) / (1000 * 60 * 60);

    if (elapsedHours > 0) {

        let currentPower = 0;

        // Dashboard Light
        if (db.data.light === "ON") {
            currentPower += 10;
        }

        // Dashboard Fan
        if (db.data.fan === "ON") {
            currentPower += 75;
        }

        // Added devices
        if (Array.isArray(db.data.devices)) {

            db.data.devices.forEach(device => {

                if (
                    String(device.status).toUpperCase() === "ON"
                ) {

                    currentPower += getDevicePower(device);

                }

            });

        }

        const consumedWh =
            currentPower * elapsedHours;

        db.data.energyUsage.todayWh += consumedWh;
        db.data.energyUsage.monthWh += consumedWh;

    }

    db.data.energyUsage.lastUpdated = now;

    await db.write();

}
// ==================== ADD LOG FUNCTION ====================

async function addLog(activity) {

    await db.read();

    if (!db.data) {
        db.data = {};
    }

    if (!db.data.logs) {
        db.data.logs = [];
    }

    if (!db.data.notifications) {
        db.data.notifications = [];
    }

    if (!db.data.settings) {
        db.data.settings = {
            theme: "light",
            language: "English",
            refresh: "ON",
            notification: "ON"
        };
    }

    db.data.logs.push({
        id: Date.now(),
        activity: activity,
        time: new Date().toLocaleString()
    });

    await db.write();
}

// ==================== ADD NOTIFICATION ====================

async function addNotification(message) {

    await db.read();

    if (!db.data.notifications) {

        db.data.notifications = [];

    }

    db.data.notifications.push({

        id: Date.now(),

        message,

        time: new Date().toLocaleString(),

        read: false

    });

    await db.write();

}

async function initializeDB() {
    await db.read();

    if (!db.data) {
        db.data = {};
    }

    db.data.light = db.data.light || "OFF";
    db.data.fan = db.data.fan || "OFF";
    db.data.temperature = db.data.temperature ?? 28;
    db.data.waterTank = db.data.waterTank ?? 75;

    db.data.users = db.data.users || [];
    db.data.devices = db.data.devices || [];
    db.data.logs = db.data.logs || [];
    db.data.notifications = db.data.notifications || [];
    
    db.data.energyUsage = db.data.energyUsage || {
        todayWh: 0,
        monthWh: 0,
        lastUpdated: Date.now()
    };

    db.data.settings = {
        theme: "light",
        language: "English",
        refresh: "ON",
        notification: "ON",
        ...(db.data.settings || {})
    };

    await db.write();

    console.log("Database initialized successfully");
}

initializeDB().then(() => {
       app.listen(PORT, () => {

        console.log(`Server running at http://localhost:${PORT}`);

    });

});
   // ==================== AUTH MIDDLEWARE ====================

function isAuthenticated(req, res, next) {

    if (!req.session.user) {

        return res.status(401).json({

            message: "Please Login First"

        });

    }

    next();

} 



// Home Route
// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Get current status
app.get("/api/status", isAuthenticated, async (req, res) => {
    await db.read();

    res.json(db.data);

});


// Light ON
app.post("/api/light/on", isAuthenticated, async (req, res) => {

    await db.read();

    db.data.light = "ON";

    await db.write();

    await addLog("Light Turned ON");
    await addNotification("💡 Light Turned ON");

    res.json({ message: "Light Turned ON" });

});


// Light OFF
app.post("/api/light/off", isAuthenticated, async (req, res) => {

    await db.read();

    db.data.light = "OFF";

    await db.write();

    await addLog("Light Turned OFF");
    await addNotification("💡 Light Turned OFF");

    res.json({ message: "Light Turned OFF" });

});


// Fan ON
app.post("/api/fan/on", isAuthenticated, async (req, res) => {

    await db.read();

    db.data.fan = "ON";

    await db.write();

    await addLog("Fan Turned ON");
    await addNotification("🌀 Fan Turned ON");

    res.json({ message: "Fan Turned ON" });

});


// Fan OFF
app.post("/api/fan/off", isAuthenticated, async (req, res) => {

    await db.read();

    db.data.fan = "OFF";

    await db.write();

    await addLog("Fan Turned OFF");
    await addNotification("🌀 Fan Turned OFF");

    res.json({ message: "Fan Turned OFF" });

});
// Update Temperature
app.post("/api/temperature/:value", isAuthenticated, async (req, res) => {

    await db.read();

    db.data.temperature = Number(req.params.value);

    await db.write();

    await addLog("Temperature Updated to " + req.params.value + "°C");
    if (Number(req.params.value) >= 35) {

    await addNotification(
        "🌡 High Temperature Alert : " + req.params.value + "°C"
    );

}

    res.json({ message: "Temperature Updated" });

});

// Update Water Tank
app.post("/api/waterTank/:value", isAuthenticated, async (req, res) => {

    await db.read();

    db.data.waterTank = Number(req.params.value);

    await db.write();

    await addLog("Water Tank Updated to " + req.params.value + "%");
    if (Number(req.params.value) <= 30) {

    await addNotification(
        "💧 Water Tank Low : " + req.params.value + "%"
    );

}

    res.json({ message: "Water Tank Updated" });

});
// ==================== GET PROFILE ====================

app.get("/api/profile", isAuthenticated, async (req, res) => {

    await db.read();

    const user = db.data.users.find(u => u.id === req.session.user.id);

    if (!user) {

        return res.status(404).json({

            message: "User Not Found"

        });

    }

    res.json({

        id: user.id,

        name: user.name,

        email: user.email

    });

});
// ==================== UPDATE PROFILE ====================

app.put("/api/profile", isAuthenticated, async (req, res) => {

    await db.read();

    const user = db.data.users.find(u => u.id === req.session.user.id);

    if (!user) {

        return res.status(404).json({

            message: "User Not Found"

        });

    }

    const { name, password } = req.body;

    if (name && name.trim() !== "") {

        user.name = name.trim();

        req.session.user.name = name.trim();

    }

    if (password && password.trim() !== "") {

        user.password = password.trim();

    }

    await db.write();

    await addLog("Profile Updated : " + user.email);

    await addNotification("👤 Profile Updated");

    req.session.save(() => {

        res.json({

            message: "Profile Updated Successfully"

        });

    });

});
// ==================== GET SETTINGS ====================

app.get("/api/settings", isAuthenticated, async (req, res) => {

    await db.read();

    res.json(db.data.settings);

});


// ==================== SAVE SETTINGS ====================

app.put("/api/settings", isAuthenticated, async (req, res) => {

    await db.read();

    db.data.settings.theme = req.body.theme;

    db.data.settings.language = req.body.language;

    db.data.settings.refresh = req.body.refresh;

    db.data.settings.notification = req.body.notification;

    await db.write();

    await addLog("Settings Updated");

    await addNotification("⚙ Settings Updated");

    res.json({

        message: "Settings Saved Successfully"

    });

});
// ===================== SIGNUP API =====================

app.post("/api/signup", async (req, res) => {

    await db.read();

    const { name, email, password } = req.body;

    const userExists = db.data.users.find(user =>
    user.email.toLowerCase() === email.toLowerCase()
);

    if (userExists) {

        return res.status(400).json({
            message: "Email already exists"
        });

    }

    db.data.users.push({

    id: Date.now(),

    name,

    email,

    password,

    createdAt: new Date().toLocaleDateString()

});
    await db.write();

    res.status(201).json({

        message: "Account created successfully"

    });

});



// ===================== LOGIN API =====================

app.post("/api/login", async (req, res) => {

    await db.read();

    const { email, password } = req.body;

    const user = db.data.users.find(user =>

    user.email.toLowerCase() === email.toLowerCase() &&

    user.password === password

);

    if (!user) {

        return res.status(401).json({

            message: "Invalid Email or Password"

        });

    }


req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email

};

console.log("Session Created:", req.session.user);

await addLog("User Logged In : " + user.email);
await addNotification(
    "👤 User Logged In : " + user.email
);

req.session.save((err) => {

    if (err) {
        return res.status(500).json({
            message: "Session could not be saved"
        });
    }

    res.json({
        message: "Login Successful",
        user: req.session.user
    });

});

});
app.get("/api/session", (req, res) => {

    if (req.session.user) {

        res.json({
            loggedIn: true,
            user: req.session.user
        });

    } else {

        res.json({
            loggedIn: false
        });

    }

});
// ===================== LOGOUT API =====================

app.post("/api/logout", async (req, res) => {
    if (req.session.user) {

    await addLog("User Logged Out : " + req.session.user.email);

    await addNotification("👋 User Logged Out");

}
    req.session.destroy(() => {

        res.json({
            message: "Logout Successful"
        });

    });

});

// ==================== ELECTRICITY USAGE ====================

function getDevicePower(device) {

    const type = String(device.type || "").toLowerCase();

    if (type.includes("light") || type.includes("bulb") || type.includes("lamp")) {
        return 60;
    }

    if (type.includes("fan")) {
        return 75;
    }

    if (type.includes("ac") || type.includes("air conditioner")) {
        return 1500;
    }

    if (type.includes("tv") || type.includes("television")) {
        return 120;
    }

    if (type.includes("refrigerator") || type.includes("fridge")) {
        return 200;
    }

    if (type.includes("heater")) {
        return 2000;
    }

    if (type.includes("washing")) {
        return 500;
    }

    if (type.includes("computer") || type.includes("pc")) {
        return 250;
    }

    // Default power for unknown devices
    return 100;
}


function calculateEnergyUsage() {

    let totalWatts = 0;

    // Existing Light
    if (db.data.light === "ON") {
        totalWatts += 60;
    }

    // Existing Fan
    if (db.data.fan === "ON") {
        totalWatts += 75;
    }

    // Devices added through Device Management
    if (Array.isArray(db.data.devices)) {

        db.data.devices.forEach(device => {

            if (String(device.status).toUpperCase() === "ON") {

                totalWatts += getDevicePower(device);

            }

        });

    }

    return totalWatts;
}


// Get electricity usage
app.get("/api/energy", isAuthenticated, async (req, res) => {

    await db.read();

    const now = Date.now();

    if (!db.data.energyUsage) {

        db.data.energyUsage = {
            todayWh: 0,
            monthWh: 0,
            lastUpdated: now
        };

    }

    const elapsedHours =
        (now - db.data.energyUsage.lastUpdated) / (1000 * 60 * 60);

    const currentWatts = calculateEnergyUsage();

    const energyUsedWh = currentWatts * elapsedHours;

    db.data.energyUsage.todayWh += energyUsedWh;
    db.data.energyUsage.monthWh += energyUsedWh;
    db.data.energyUsage.lastUpdated = now;

    await db.write();

    const todayKWh =
    Number((db.data.energyUsage.todayWh / 1000).toFixed(3));

const monthKWh =
    Number((db.data.energyUsage.monthWh / 1000).toFixed(3));

// Estimated electricity cost
const electricityRate = 8;

const todayCost =
    Number((todayKWh * electricityRate).toFixed(2));

const monthCost =
    Number((monthKWh * electricityRate).toFixed(2));

res.json({

    watts: Math.round(currentWatts),

    todayKWh: todayKWh,

    monthKWh: monthKWh,

    todayCost: todayCost,

    monthCost: monthCost,

    rate: electricityRate

});

});
  
// ==================== GET ALL DEVICES ====================

app.get("/api/devices", isAuthenticated, async (req, res) => {

    await db.read();

    res.json(db.data.devices);

});

// ==================== ADD DEVICE ====================

app.post("/api/devices", isAuthenticated, async (req, res) => {

    await db.read();

    const { name, type, room, status } = req.body;

    const newDevice = {

       id: Date.now(),

       name,

       type,

       room,

       status,

       createdAt: new Date().toLocaleString()

};

    db.data.devices.push(newDevice);

    await db.write();

    await addLog("Device Added : " + name);
    await addNotification(
    "➕ Device Added : " + name
);

    res.json({
    message: "Device Added Successfully"
});
});

// ==================== UPDATE DEVICE ====================

app.put("/api/devices/:id", isAuthenticated, async (req, res) => {

    await db.read();

    const id = Number(req.params.id);

    const device = db.data.devices.find(d => d.id === id);

    if (!device) {

        return res.status(404).json({
            message: "Device Not Found"
        });

    }

    device.name = req.body.name;

    device.type = req.body.type;

    device.room = req.body.room;

    device.status = req.body.status;

    device.updatedAt = new Date().toLocaleString();

    await db.write();

    await addLog("Device Updated : " + device.name);
    await addNotification(
    "✏ Device Updated : " + device.name
);

    res.json({
        message: "Device Updated Successfully"
});

});

// ==================== DELETE DEVICE ====================

app.delete("/api/devices/:id", isAuthenticated, async (req, res) => {

    await db.read();

    const id = Number(req.params.id);

   const deletedDevice = db.data.devices.find(d => d.id === id);
   if (!deletedDevice) {

    return res.status(404).json({

        message: "Device Not Found"

    });

}

   db.data.devices = db.data.devices.filter(d => d.id !== id);

   await db.write();

   if (deletedDevice) {
       await addLog("Device Deleted : " + deletedDevice.name);
       await addNotification(
    "❌ Device Deleted : " + deletedDevice.name
); 
   }

   res.json({
    message: "Device Deleted Successfully"
});

});
// ==================== GET LOGS ====================

app.get("/api/logs",isAuthenticated,async(req,res)=>{

    await db.read();

    res.json(db.data.logs);

});



// ==================== DELETE SINGLE LOG ====================

app.delete("/api/logs/:id",isAuthenticated,async(req,res)=>{

    await db.read();

    const id=Number(req.params.id);

    db.data.logs=db.data.logs.filter(

        log=>log.id!==id

    );

    await db.write();

    res.json({

        message:"Log Deleted"

    });

});



// ==================== CLEAR LOGS ====================

app.delete("/api/logs",isAuthenticated,async(req,res)=>{

    await db.read();

    db.data.logs=[];

    await db.write();

    res.json({

        message:"Logs Cleared"

    });

});
// ==================== GET NOTIFICATIONS ====================

app.get("/api/notifications", isAuthenticated, async (req, res) => {

    await db.read();

    res.json(db.data.notifications);

});


// ==================== DELETE NOTIFICATION ====================

app.delete("/api/notifications/:id", isAuthenticated, async (req, res) => {

    await db.read();

    const id = Number(req.params.id);

    db.data.notifications =
        db.data.notifications.filter(n => n.id !== id);

    await db.write();

    res.json({

        message: "Notification Deleted"

    });

});


// ==================== CLEAR ALL NOTIFICATIONS ====================

app.delete("/api/notifications", isAuthenticated, async (req, res) => {

    await db.read();

    db.data.notifications = [];

    await db.write();

    res.json({

        message: "All Notifications Cleared"

    });

});
// Home page
app.get("/", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login.html");
    }

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});


// ==================== SERVER ERROR HANDLER ====================

app.use((err, req, res, next) => {

    console.error("SERVER ERROR:", err);

    res.status(500).json({
        message: "Internal Server Error"
    });

});
