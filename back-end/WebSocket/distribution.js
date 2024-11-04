const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });
console.log("WebSocket server is running on ws://localhost:8080");

// Symbols for Spot and Futures trading streams
const spotSymbols = [
  "btcusdt",
  "ethusdt",
  "bnbusdt",
  "xrpusdt",
  "ltcusdt",
  "adausdt",
  "solusdt",
  "dotusdt",
  "dogeusdt",
  "maticusdt",
  "trxusdt",
  "shibusdt",
  "avaxusdt",
  "linkusdt",
  "xlmusdt",
  "filusdt",
  "lunausdt",
  "etusdt",
  "icpusdt",
  "nearusdt",
  "vetusdt",
  "thetausdt",
  "eosusdt",
  "aaveusdt",
  "sandusdt",
  "manausdt",
  "zilusdt",
  "qtumusdt",
  "batusdt",
  "enjusdt",
  "chzusdt",
  "dgbusdt",
  "dashusdt",
  "nanousdt",
  "zrxusdt",
  "wavesusdt",
  "ksmusdt",
  "bttusdt",
  "yfiusdt",
  "grtusdt",
];

const futuresSymbols = [...spotSymbols];

// URLs for Binance WebSocket streams
const spotStreamUrl = createStreamUrl(spotSymbols, "stream.binance.com:9443");
const futuresStreamUrl = createStreamUrl(futuresSymbols, "fstream.binance.com");

/**
 * Utility function to create a Binance stream URL from symbol list and host
 */
function createStreamUrl(symbols, host) {
  const streams = symbols.map((symbol) => `${symbol}@ticker`).join("/");
  return `wss://${host}/stream?streams=${streams}`;
}

// WebSocket connection handler
server.on("connection", (clientSocket) => {
  console.log("Client connected");

  let spotSocket, futuresSocket;

  clientSocket.on("message", (message) => {
    try {
      const request = JSON.parse(message);
      handleClientRequest(request, clientSocket);
    } catch (error) {
      console.error("Failed to parse client message:", error);
    }
  });

  // Handle client requests for Spot or Futures data
  function handleClientRequest(request, clientSocket) {
    if (request.type === "spot") {
      subscribeToSpotData(clientSocket);
    } else if (request.type === "futures") {
      subscribeToFuturesData(clientSocket);
    } else {
      console.error("Unknown request type:", request.type);
    }
  }

  // Subscribe to Spot WebSocket stream
  function subscribeToSpotData(clientSocket) {
    console.log("Client requested Spot data");
    spotSocket = new WebSocket(spotStreamUrl);

    spotSocket.on("open", () => {
      console.log("Connected to Binance Spot WebSocket stream");
    });

    spotSocket.on("message", (data) => {
      sendPriceDataToClient(data, "spot", clientSocket);
    });

    spotSocket.on("error", (error) => {
      console.error("Spot WebSocket error:", error);
    });
  }

  // Subscribe to Futures WebSocket stream
  function subscribeToFuturesData(clientSocket) {
    console.log("Client requested Futures data");
    futuresSocket = new WebSocket(futuresStreamUrl);

    futuresSocket.on("open", () => {
      console.log("Connected to Binance Futures WebSocket stream");
    });

    futuresSocket.on("message", (data) => {
      sendPriceDataToClient(data, "futures", clientSocket);
    });

    futuresSocket.on("error", (error) => {
      console.error("Futures WebSocket error:", error);
    });
  }

  // Parse and forward price data to client
  function sendPriceDataToClient(data, type, clientSocket) {
    const parsedData = JSON.parse(data);
    const message = parsedData.data;
    if (message) {
      const { s: symbol, c: price } = message;
      clientSocket.send(JSON.stringify({ type, symbol, price }));
    }
  }

  // Handle client disconnection
  clientSocket.on("close", () => {
    console.log("Client disconnected");
    if (spotSocket) spotSocket.close();
    if (futuresSocket) futuresSocket.close();
  });
});
