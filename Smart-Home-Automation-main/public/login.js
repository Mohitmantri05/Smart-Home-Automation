async function login(){

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    if(email === "" || password === ""){

        alert("Please enter Email and Password");

        return;

    }

    try{

        const response = await fetch("/api/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        alert(data.message);

        if(response.ok){

            window.location.href="/";

        }

    }

    catch(error){

        alert("Unable to connect to the server.");

    }

}



function applyTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark-mode");

    }else{

        document.body.classList.remove("dark-mode");

    }

}

applyTheme();