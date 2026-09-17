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


// ==================== LOAD NOTIFICATIONS ====================

async function loadNotifications() {

    const response = await fetch("/api/notifications");

    const notifications = await response.json();

    const table = document.querySelector("#notificationTable tbody");

    table.innerHTML = "";

    notifications.reverse().forEach(notification => {

        table.innerHTML += `

        <tr>

        <td>${notification.id}</td>

        <td>${notification.message}</td>

        <td>${notification.time}</td>

        <td>${notification.read ? "Read" : "Unread"}</td>

        <td>

        <button onclick="deleteNotification(${notification.id})">

        Delete

        </button>

        </td>

        </tr>

        `;

    });

}


// ==================== DELETE ====================

async function deleteNotification(id){

    await fetch("/api/notifications/" + id,{

        method:"DELETE"

    });

    loadNotifications();

}


// ==================== CLEAR ====================

async function clearNotifications(){

    const ok = confirm("Clear all notifications?");

    if(!ok){

        return;

    }

    await fetch("/api/notifications",{

        method:"DELETE"

    });

    loadNotifications();

}

loadNotifications();

setInterval(loadNotifications,5000);
function applyTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark-mode");

    }else{

        document.body.classList.remove("dark-mode");

    }

}

applyTheme();