const chat = document.getElementById('chat');
const inputText = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');

const send = document.getElementById('send');

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

// Send a new message
send.onclick = () => {
    sendMessage();
};
inputText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
})

function sendMessage() {
    const text = inputText.value.trim();
    if (!text) return;

    socket.emit("message", { sender: usernameInput.value, text });
    inputText.value = "";
}