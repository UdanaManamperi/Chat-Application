const inputElm = document.querySelector("#flexSwitchCheckDefault");
const element = document.body;

const txtMessageElm = document.querySelector("#txt-message");
const btnSendElm = document.querySelector("#btn-send");
const outputElm = document.querySelector("#output");
const { API_BASE_URL } = process.env;
inputElm.addEventListener("change", () => {
    if (inputElm.checked) {
        element.dataset.bsTheme = "dark";
    } else {
        element.dataset.bsTheme = "light";
    }
})

btnSendElm.addEventListener('click', () => {
    const message = txtMessageElm.value.trim();
    if (!message) return;

    const myObj = {
        message,
        email: "abc@gmail.com"
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
    messageElm.innerText = message;
}