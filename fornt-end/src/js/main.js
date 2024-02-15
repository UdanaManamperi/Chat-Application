import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase.js";
const provider = new GoogleAuthProvider;


const inputElm = document.querySelector("#flexSwitchCheckDefault");
const element = document.body;

const txtMessageElm = document.querySelector("#txt-message");
const btnSendElm = document.querySelector("#btn-send");
const outputElm = document.querySelector("#output");
const btnSignInElm = document.querySelector("#btn-sign-in");
const loginOverlayElm = document.querySelector("#login-overlay");
const accountElm = document.querySelector("#account");
const userNameElm = document.querySelector("#user-name");
const userEmailElm = document.querySelector("#user-email");
const btnSignOutElm = document.querySelector("#btn-sign-out");
const { API_BASE_URL } = process.env;

const user = {
    email: null,
    name: null,
    picture: null
};


inputElm.addEventListener("click", () => {
    if (inputElm.checked) {
        element.dataset.bsTheme = "dark";
        outputElm.classList.add("dark-mode");
        accountElm.querySelector("#account-details").classList.add("bg-dark");
        // document.querySelectorAll(".message").forEach(msg => {
        //     msg.classList.add("bg-light-subtle");
        // });
        document.querySelectorAll(".message.me").forEach((meMsg) => {
            meMsg.classList.add("dark-mode");
        });

        document.querySelectorAll(".message.others").forEach((meMsg) => {
            meMsg.classList.add("dark-mode");
        });

    } else {
        element.dataset.bsTheme = "light";
        accountElm.querySelector("#account-details").classList.remove("bg-dark");
        // document.querySelectorAll(".message").forEach(msg => {
        //     msg.classList.remove("bg-light-subtle")
        // });
        document.querySelectorAll(".message.me").forEach((meMsg) => {
            meMsg.classList.remove("dark-mode");
        });
        document.querySelectorAll(".message.others").forEach((meMsg) => {
            meMsg.classList.remove("dark-mode");
        });


    }
})

btnSendElm.addEventListener('click', () => {
    const message = txtMessageElm.value.trim();
    if (!message) return;

    const myObj = {
        message,
        email: user.email
    }

    fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(myObj)
    }).then(res => {
        if (res.ok) {
            addChatMessageRecord(myObj);
            outputElm.scrollTo(0, outputElm.scrollHeight);
            txtMessageElm.value = "";
            txtMessageElm.focus();
        } else {
            alert("Failed to send the chat message")

        }
    }).catch(err => {
        alert(
            "Failed to connect with the server, please check the connection."
        );
    })
})

function addChatMessageRecord({ message, email }) {
    const messageElm = document.createElement("div");
    messageElm.classList.add("message");
    outputElm.append(messageElm);
    if (email === user.email) {
        messageElm.classList.add("me");
    } else {
        messageElm.classList.add("others");
    }
    if (element.dataset.bsTheme === "dark") {
        messageElm.classList.add("dark-mode");
    }
    outputElm.append(messageElm);
    messageElm.innerText = message;
}
btnSignInElm.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then(res => {
            user.name = res.user.displayName;
            user.email = res.user.email;
            user.picture = res.user.photoURL;
            console.log(res);
            loginOverlayElm.classList.add("d-none");
            finalizeLogin();
        })
        .catch(err => alert("Failed to login, try again later!"))
})

function finalizeLogin() {
    userNameElm.innerText = user.name;
    userEmailElm.innerText = user.email;
    accountElm.style.backgroundImage = `url(${user.picture})`;
}

accountElm.addEventListener("click", (e) => {
    accountElm.querySelector("#account-details").classList.remove("d-none");
    e.stopPropagation();
})

btnSignOutElm.addEventListener("click", (e) => {
    accountElm.querySelector("#account-details").classList.add("d-none");
    e.stopPropagation();
    signOut(auth);
})

document.addEventListener("click", () => {
    accountElm.querySelector("#account-details").classList.add("d-none");
})