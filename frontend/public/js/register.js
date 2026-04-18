import { common } from "./common.js";

document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    errorMsg.style.display = "none";
    errorMsg.innerText = "";

    try {
        const body = { name, username, email, password };
        common.sendRequest("POST", "/register", body, false).then((result) => {
            if (!result.isError) {
                // hcaer cosas con jwt
                localStorage.removeItem("token");
                window.location.href = "/";
            } else {
                errorMsg.style.display = "block";
                errorMsg.innerText = result.message;
            }
        });
    } catch (err) {
        console.error(err);
        errorMsg.style.display = "block";
        errorMsg.innerText = result.message;
    }
});
