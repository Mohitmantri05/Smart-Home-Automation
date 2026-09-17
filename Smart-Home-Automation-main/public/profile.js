// ==================== CHECK SESSION ====================

async function checkSession(){

    const response = await fetch("/api/session");

    const data = await response.json();

    if(!data.loggedIn){

        window.location.href="login.html";

        return;

    }

}

checkSession();



// ==================== LOGOUT ====================

async function logout(){

    await fetch("/api/logout",{

        method:"POST"

    });

    window.location.href="login.html";

}



// ==================== LOAD PROFILE ====================

async function loadProfile(){

    const sessionResponse=await fetch("/api/session");

    const session=await sessionResponse.json();

    const statusResponse=await fetch("/api/status");

    const status=await statusResponse.json();

    document.getElementById("userid").innerHTML=session.user.id;

    document.getElementById("name").value=session.user.name;

    document.getElementById("email").value=session.user.email;

    document.getElementById("deviceCount").innerHTML=status.devices.length;

    document.getElementById("notificationCount").innerHTML=status.notifications.length;

    document.getElementById("logCount").innerHTML=status.logs.length;

}



// ==================== UPDATE PROFILE ====================

async function updateProfile(){

    const name=document.getElementById("name").value;

    const password=document.getElementById("password").value;

    const response=await fetch("/api/profile",{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            name,

            password

        })

    });

    const data=await response.json();

    alert(data.message);

    loadProfile();

}

loadProfile();
function applyTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark-mode");

    }else{

        document.body.classList.remove("dark-mode");

    }

}

applyTheme();