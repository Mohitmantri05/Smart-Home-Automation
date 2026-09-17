// ======================================================
// HOMESPHERE GLOBAL LANGUAGE SYSTEM
// ======================================================

const translations = {

    "Dashboard": "डैशबोर्ड",
    "Devices": "डिवाइस",
    "Logs": "लॉग्स",
    "Notifications": "सूचनाएं",
    "Profile": "प्रोफ़ाइल",
    "Settings": "सेटिंग्स",
    "Logout": "लॉगआउट",

    "Smart Home Automation Dashboard": "स्मार्ट होम ऑटोमेशन डैशबोर्ड",
    "Your home, smarter every day": "आपका घर, हर दिन और स्मार्ट",
    "Search Devices...": "डिवाइस खोजें...",

    "Light": "लाइट",
    "Fan": "पंखा",
    "Temperature": "तापमान",
    "Water Tank": "पानी की टंकी",
    "Current Time": "वर्तमान समय",
    "Current Date": "वर्तमान तारीख",
    "Weather": "मौसम",
    "Total Logs": "कुल लॉग्स",
    "Offline Devices": "ऑफलाइन डिवाइस",
    "Energy Usage": "ऊर्जा उपयोग",
    "Total Devices": "कुल डिवाइस",
    "Active Devices": "सक्रिय डिवाइस",

    "Turn ON": "चालू करें",
    "Turn OFF": "बंद करें",
    "Update Temperature": "तापमान अपडेट करें",
    "Update Water Tank": "पानी की टंकी अपडेट करें",

    "Light ON": "लाइट चालू",
    "Light OFF": "लाइट बंद",
    "Fan ON": "पंखा चालू",
    "Fan OFF": "पंखा बंद",

    "Device Status": "डिवाइस स्थिति",
    "Dashboard Summary": "डैशबोर्ड सारांश",
    "Recent Activity": "हाल की गतिविधि",
    "Quick Actions": "त्वरित क्रियाएं",
    "Devices by Room": "कमरे के अनुसार डिवाइस",
    "System Health": "सिस्टम स्वास्थ्य",
    "System Uptime": "सिस्टम अपटाइम",
    "Devices by Type": "प्रकार के अनुसार डिवाइस",
    "Dashboard Report": "डैशबोर्ड रिपोर्ट",
    "Device Control Panel": "डिवाइस नियंत्रण पैनल",
    "Device Status Filter": "डिवाइस स्थिति फ़िल्टर",
    "Room Summary": "कमरे का सारांश",
    "Device Management Analytics": "डिवाइस प्रबंधन विश्लेषण",
    "Most Active Device": "सबसे सक्रिय डिवाइस",

    "Activity": "गतिविधि",
    "Time": "समय",
    "Room": "कमरा",
    "Device": "डिवाइस",
    "Health": "स्वास्थ्य",
    "Status": "स्थिति",

    "Add Device": "डिवाइस जोड़ें",
    "Device Name": "डिवाइस का नाम",
    "Device Type": "डिवाइस का प्रकार",
    "Device Room": "डिवाइस का कमरा",
    "Edit": "संपादित करें",
    "Delete": "हटाएं",

    "ON": "चालू",
    "OFF": "बंद",

    "All Devices": "सभी डिवाइस",
    "Only ON Devices": "केवल चालू डिवाइस",
    "Only OFF Devices": "केवल बंद डिवाइस",

    "General Settings": "सामान्य सेटिंग्स",
    "Theme": "थीम",
    "Language": "भाषा",
    "Auto Refresh": "ऑटो रिफ्रेश",
    "Save Settings": "सेटिंग्स सेव करें",

    "Name": "नाम",
    "Email": "ईमेल",
    "Password": "पासवर्ड",
    "Update Profile": "प्रोफ़ाइल अपडेट करें",

    "Server": "सर्वर",
    "Database": "डेटाबेस",
    "Checking...": "जांच हो रही है...",
    "Loading...": "लोड हो रहा है...",

    "Light": "लाइट",
    "Dark": "डार्क",
    "English": "अंग्रेज़ी",
    "Hindi": "हिंदी",

    "Download CSV Report": "CSV रिपोर्ट डाउनलोड करें",
    "Toggle Status": "स्थिति बदलें"
};


// ======================================================
// STORE ORIGINAL TEXT
// ======================================================

const originalText = new WeakMap();


// ======================================================
// TRANSLATE TEXT
// ======================================================

function translatePage() {

    const language =
        localStorage.getItem("language") || "English";


    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );


    const textNodes = [];

    let node;

    while (node = walker.nextNode()) {

        // Ignore script/style content
        if (
            node.parentElement &&
            (
                node.parentElement.tagName === "SCRIPT" ||
                node.parentElement.tagName === "STYLE"
            )
        ) {
            continue;
        }

        textNodes.push(node);
    }


    textNodes.forEach(node => {

        // Save original English text once
        if (!originalText.has(node)) {

            originalText.set(
                node,
                node.nodeValue
            );

        }


        const original =
            originalText.get(node);

        const cleanText =
            original.trim();


        if (!cleanText) return;


        // English
        if (language === "English") {

            node.nodeValue = original;

            return;
        }


        // Hindi
        if (
            language === "Hindi" &&
            translations[cleanText]
        ) {

            node.nodeValue =
                original.replace(
                    cleanText,
                    translations[cleanText]
                );

        }

    });


    // ==================================================
    // PLACEHOLDERS
    // ==================================================

    document
        .querySelectorAll("[placeholder]")
        .forEach(element => {

            if (!element.dataset.originalPlaceholder) {

                element.dataset.originalPlaceholder =
                    element.getAttribute("placeholder");

            }


            const original =
                element.dataset.originalPlaceholder;


            if (language === "Hindi") {

                if (translations[original]) {

                    element.setAttribute(
                        "placeholder",
                        translations[original]
                    );

                }

            } else {

                element.setAttribute(
                    "placeholder",
                    original
                );

            }

        });


    // ==================================================
    // SELECT OPTIONS
    // ==================================================

    document
        .querySelectorAll("option")
        .forEach(option => {

            if (!option.dataset.originalText) {

                option.dataset.originalText =
                    option.textContent.trim();

            }


            const original =
                option.dataset.originalText;


            if (
                language === "Hindi" &&
                translations[original]
            ) {

                option.textContent =
                    translations[original];

            } else {

                option.textContent =
                    original;

            }

        });

}


// ======================================================
// CHANGE LANGUAGE
// ======================================================

function setLanguage(language) {

    localStorage.setItem(
        "language",
        language
    );

    translatePage();

}


document.addEventListener("DOMContentLoaded", () => {
    translatePage();
});