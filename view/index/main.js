const chat = document.getElementById('chat');
const inputText = document.getElementById('input');
const send = document.getElementById('send');

// Connect to backend via Socket.IO
const socket = io();

// Load old messages
fetch("/messages")
  .then(res => res.json())
  .then(messages => {
    messages.forEach(msg => {
      chat.insertAdjacentHTML("beforeend", `<div><b>${msg.sender}:</b> ${msg.text}</div>`);
    });
    chat.scrollTop = chat.scrollHeight; // scroll to bottom after load
  });

// Listen for new messages
socket.on("message", (msg) => {
  chat.insertAdjacentHTML("beforeend", `<div><b>${msg.sender}:</b> ${msg.text}</div>`);
  chat.scrollTop = chat.scrollHeight; // auto-scroll
});

// Send a new message
send.onclick = () => {
  const text = inputText.value.trim();
  if (!text) return;

  socket.emit("message", { sender: "Anon", text });
  inputText.value = "";
};