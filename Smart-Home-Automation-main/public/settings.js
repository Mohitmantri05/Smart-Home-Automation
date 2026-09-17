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


// ==================== LANGUAGE TRANSLATIONS ====================




// ==================== LOAD SETTINGS ====================

async function loadSettings() {

    const response = await fetch("/api/settings");

    const data = await response.json();


    document.getElementById("theme").value =
        data.theme;

    document.getElementById("language").value =
        data.language;

    document.getElementById("refresh").value =
        data.refresh;

    document.getElementById("notification").value =
        data.notification;


    localStorage.setItem(
        "theme",
        data.theme
    );

    localStorage.setItem(
        "language",
        data.language
    );


    applyTheme();


    if (typeof setLanguage === "function") {

        setLanguage(data.language);

    }

}
document.addEventListener("DOMContentLoaded", () => {

    const languageSelect =
        document.getElementById("language");

    if (languageSelect) {

        languageSelect.addEventListener(
            "change",
            async () => {

                const language =
                    languageSelect.value;

                localStorage.setItem(
                    "language",
                    language
                );

                if (typeof setLanguage === "function") {

                    setLanguage(language);

                }

            }
        );

    }

});

// ==================== SAVE SETTINGS ====================

async function saveSettings() {

    const theme =
        document.getElementById("theme").value;

    const language =
        document.getElementById("language").value;

    const refresh =
        document.getElementById("refresh").value;

    const notification =
        document.getElementById("notification").value;


    const response = await fetch("/api/settings", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            theme,
            language,
            refresh,
            notification

        })

    });


    const data = await response.json();


    // Store settings locally
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);


    // Apply theme
    applyTheme();


    // Apply language globally
    if (typeof setLanguage === "function") {

        setLanguage(language);

    }


    alert(data.message);
}


// ==================== LANGUAGE CHANGE ====================




// ==================== THEME ====================

function applyTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark-mode");

    } else {

        document.body.classList.remove("dark-mode");

    }
}


// ==================== START ====================

document.addEventListener("DOMContentLoaded", () => {

    const languageSelect =
        document.getElementById("language");

    if (languageSelect) {

        languageSelect.addEventListener(
            "change",
            languageChanged
        );

    }

    loadSettings();

});