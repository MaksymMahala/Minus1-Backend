const WebSocket = require("ws");

const socket = new WebSocket("ws://localhost:8080");

socket.on("open", () => {
  console.log("Connected to WebSocket server");
});

socket.on("message", (data) => {
  const priceUpdate = JSON.parse(data);
  console.log(`Price update for ${priceUpdate.symbol}: $${priceUpdate.price}`);
});

socket.on("close", () => {
  console.log("Disconnected from WebSocket server");
});
