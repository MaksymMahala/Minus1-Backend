// cryptoSymbols.js
const recentCryptoCurrencySymbols = new Set([
  "APTUSDT",
  "FTMUSDT",
  "NEARUSDT",
  "GRTUSDT",
  "ATOMUSDT",
  "ICPUSDT",
  "FILUSDT",
  "ALGOUSDT",
  "VETUSDT",
  "AAVEUSDT",
  "FTTUSDT",
  "SANDUSDT",
  "MANAUSDT",
  "FLOWUSDT",
  "EOSUSDT",
]);

const topCryptoCurrencySymbols = new Set([
  "BTCUSDT",
  "ETHUSDT",
  "USDTUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "DOTUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "TRXUSDT",
  "SHIBUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "LTCUSDT",
]);

const pricesArray = new Set([
  "BTCUSDT",
  "ETHUSDT",
  "USDTUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "DOTUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "TRXUSDT",
  "SHIBUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "LTCUSDT",
  "APTUSDT",
  "FTMUSDT",
  "NEARUSDT",
  "GRTUSDT",
  "ATOMUSDT",
  "ICPUSDT",
  "FILUSDT",
  "ALGOUSDT",
  "VETUSDT",
  "AAVEUSDT",
  "FTTUSDT",
  "SANDUSDT",
  "MANAUSDT",
  "FLOWUSDT",
  "EOSUSDT",
]);

module.exports = {
  recentCryptoCurrencySymbols,
  topCryptoCurrencySymbols,
  pricesArray,
};

// const WebSocket = require("ws");

// const server = new WebSocket.Server({ port: 8000 });

// server.on("connection", (socket) => {
//   console.log("Client connected");

//   const topCryptocurrencySymbols = [
//     "BTCUSDT",
//     "ETHUSDT",
//     "USDTUSDT",
//     "BNBUSDT",
//     "XRPUSDT",
//     "ADAUSDT",
//     "SOLUSDT",
//     "DOTUSDT",
//     "DOGEUSDT",
//     "MATICUSDT",
//     "TRXUSDT",
//     "SHIBUSDT",
//     "AVAXUSDT",
//     "LINKUSDT",
//     "LTCUSDT",
//   ];

//   const spotStreams = spotSymbols.map((symbol) => `${symbol}@ticker`).join("/");
//   const spotStreamUrl = `wss://stream.binance.com:9443/stream?streams=${spotStreams}`;

//   const futuresStreams = futuresSymbols
//     .map((symbol) => `${symbol}@ticker`)
//     .join("/");
//   const futuresStreamUrl = `wss://fstream.binance.com/stream?streams=${futuresStreams}`;

//   const spotSocket = new WebSocket(spotStreamUrl);
//   spotSocket.on("open", () => {
//     console.log("Connected to Binance Spot WebSocket stream");
//   });

//   spotSocket.on("message", (data) => {
//     const parsedData = JSON.parse(data);
//     const message = parsedData.data;
//     const price = message.c;
//     const symbol = message.s;

//     socket.send(JSON.stringify({ type: "spot", symbol, price }));
//     console.log(`Spot Price: ${price} Symbol: ${symbol}`);
//   });

//   spotSocket.on("error", (error) => {
//     console.error("Spot WebSocket error:", error);
//   });

//   const futuresSocket = new WebSocket(futuresStreamUrl);
//   futuresSocket.on("open", () => {
//     console.log("Connected to Binance Futures WebSocket stream");
//   });

//   futuresSocket.on("message", (data) => {
//     const parsedData = JSON.parse(data);
//     const message = parsedData.data;
//     const price = message.c;
//     const symbol = message.s;

//     socket.send(JSON.stringify({ type: "futures", symbol, price }));
//     console.log(`Futures Price: ${price} Symbol: ${symbol}`);
//   });

//   futuresSocket.on("error", (error) => {
//     console.error("Futures WebSocket error:", error);
//   });

//   socket.on("close", () => {
//     console.log("Client disconnected");
//     spotSocket.close();
//     futuresSocket.close();
//   });
// });

// console.log("WebSocket server is running on ws://localhost:8000");
