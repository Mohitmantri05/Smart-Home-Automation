async function signup() {

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;


    if (name === "" || email === "" || password === "" || confirmPassword === "") {

        alert("Please fill all fields");

        return;

    }


    if (password !== confirmPassword) {

        alert("Passwords do not match");

        return;

    }


    const response = await fetch("/api/signup", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name,

            email,

            password

        })

    });


    const data = await response.json();

    alert(data.message);


    if (response.ok) {

        window.location.href = "login.html";

    }

}