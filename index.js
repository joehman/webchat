const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

const port = 8000;
const app = express();
const server = http.createServer(app); // attach Express to HTTP
const io = new Server(server);         // attach Socket.IO to HTTP

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "view/index/"))); // serve index.html automatically

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Message schema + model
const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  timeStamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// Routes
app.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ timeStamp: 1 });
  res.json(messages);
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("message", async (data) => {
    const msg = new Message(data);
    await msg.save();

    io.emit("message", msg); // broadcast to everyone
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port: ${port}`);
});
