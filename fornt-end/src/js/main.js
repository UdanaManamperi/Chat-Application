import { GoogleAuthProvider,  onAuthStateChanged,signInWithPopup, signOut } from "firebase/auth";
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
let ws = null;


inputElm.addEventListener("click", () => {
    if (inputElm.checked) {
        element.dataset.bsTheme = "dark";
        outputElm.classList.add("dark-mode");
        accountElm.querySelector("#account-details").classList.add("bg-dark");

        document.querySelectorAll(".message.me").forEach((meMsg) => {
            meMsg.classList.add("dark-mode");
        });

        document.querySelectorAll(".message.others").forEach((meMsg) => {
            meMsg.classList.add("dark-mode");
        });

    } else {
        element.dataset.bsTheme = "light";
        accountElm.querySelector("#account-details").classList.remove("bg-dark");

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
        email: user.email,
        name: user.name,
        picture: user.picture
    }

    ws.send(JSON.stringify(myObj));
    addChatMessageRecord(myObj);
    outputElm.scrollTo(0, outputElm.scrollHeight);
    txtMessageElm.value = "";
    txtMessageElm.focus();

    // fetch(`${API_BASE_URL}/messages`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(myObj)
    // }).then(res => {
    //     if (res.ok) {
    //         addChatMessageRecord(myObj);
    //         outputElm.scrollTo(0, outputElm.scrollHeight);
    //         txtMessageElm.value = "";
    //         txtMessageElm.focus();
    //   } else {
    //         alert("Failed to send the chat message")
    //     }
    // }).catch(err => {
    //     alert(
    //       "Failed to connect with the server, please check the connection."
    //     );
    // })
})

function addChatMessageRecord({ message, email, name, picture  }) {
    const pictureElm = document.createElement("div");
    const messageElm = document.createElement("div");
    const messageElm2 = document.createElement("div");
    const nameElm = document.createElement("div");
    const containerElm = document.createElement("div");

    containerElm.classList.add("d-flex");

    if (element.dataset.bsTheme === "dark") {
        messageElm.classList.add("dark-mode");
        messageElm2.classList.add("dark-mode");
    }

    if (email === user.email) {
        messageElm.classList.add("me");
        messageElm.innerText = message;
        messageElm.classList.add("message");
    } else {
        pictureElm.style.backgroundImage = `url(${picture})`;
        pictureElm.classList.add("picture");
        messageElm2.classList.add("others");
        messageElm2.classList.add("message");
        nameElm.classList.add("name");
        nameElm.innerText = name;
        messageElm2.innerText = message;
    }

    containerElm.appendChild(pictureElm);
    containerElm.appendChild(messageElm2);
    outputElm.append(messageElm);
    outputElm.append(nameElm);
    outputElm.appendChild(containerElm);

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
onAuthStateChanged(auth, loggedUser => {
    if (loggedUser) {
        user.email = loggedUser.email;
        user.name = loggedUser.displayName;
        user.picture = loggedUser.photoURL;
        finalizeLogin();
        loginOverlayElm.classList.add("d-none");

        if (!ws) {
            ws = new WebSocket(`${API_BASE_URL}/messages`);
            ws.addEventListener("message", loadNewChatMessages);
            ws.addEventListener("error", () => {
                alert("Connection failure, try refreshing the application");
            })
        }

    } else {
        user.email = null;
        user.name = null;
        user.picture = null;
        loginOverlayElm.classList.remove("d-none");

        if (ws) {
            ws.close();
            ws = null;
        }
    }
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

// function loadAllMessages() {
//     fetch(`${API_BASE_URL / messages}`)
//         .then(req => req.json())
//         .then(chatMessage => {
//             Array.from(outputElm.children).forEach(child => child.remove());
//             chatMessage.forEach(msg => addChatMessageRecord(msg));
//         })
//         .catch(err => console.log(err));
// }
//
// setInterval(loadAllMessages, 1000);
//
// loadAllMessages();

function loadNewChatMessages(e) {
    const msg = JSON.parse(e.data);
    addChatMessageRecord({
        message: msg.message,
        email: msg.email,
        name: msg.name,
        picture: msg.picture,
    });
}