import { common } from "./common.js";

const result = await common.sendRequest("GET", "/me", null, true);

if (result.token){
    window.location.href = "/lobby";
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    errorMsg.style.display = "none";
    errorMsg.innerText = "";

    try {
        const body = { email, password };
        common.sendRequest("POST", "/auth", body, false).then((result) => {
            if (!result.data.isError) {
                // hcaer cosas con jwt
                localStorage.setItem("token", result.token);
                window.location.href = "/lobby";
            } else {
                errorMsg.style.display = "block";
                errorMsg.innerText = result.data.message;
            }
        });
    } catch (err) {
        console.error(err);
        errorMsg.style.display = "block";
        errorMsg.innerText = "Error conectando con el servidor...";
    }
});
