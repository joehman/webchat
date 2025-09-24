const chat = document.getElementById('chat');
const inputText = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');



// Connect to backend via Socket.IO
const socket = io();

// Load old messages
fetch("/messages")
  .then(res => res.json())
  .then(messages => {
    messages.forEach(msg => {
        const date = new Date(msg.timeStamp);
        chat.insertAdjacentHTML("beforeend", `<div> <em>${date.toLocaleString()}</em> <b>${msg.sender}:</b> ${msg.text}</div>`);
    });
    chat.scrollTop = chat.scrollHeight; // scroll to bottom after load
  });

// Listen for new messages
socket.on("message", (msg) => {
    const date = new Date(msg.timeStamp);
    chat.insertAdjacentHTML("beforeend", `<div> <em>${date.toLocaleString()}</em> <b>${msg.sender}:</b> ${msg.text}</div>`);
    chat.scrollTop = chat.scrollHeight; // auto-scroll
});

inputText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
})

function sendMessage() {
    const text = inputText.value.trim();
    if (!text) return;

    document.cookie = `username=${usernameInput.value}`;
    socket.emit("message", { sender: usernameInput.value, text });
    inputText.value = "";
}

usernameInput.value = getCookie("username");

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null; // not found
}
