const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("Client connected");

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

  const futuresSymbols = [
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

  const spotStreams = spotSymbols.map((symbol) => `${symbol}@ticker`).join("/");
  const spotStreamUrl = `wss://stream.binance.com:9443/stream?streams=${spotStreams}`;

  const futuresStreams = futuresSymbols
    .map((symbol) => `${symbol}@ticker`)
    .join("/");
  const futuresStreamUrl = `wss://fstream.binance.com/stream?streams=${futuresStreams}`;

  let spotSocket, futuresSocket;

  // Receive initial message from the client to decide which stream to subscribe to
  socket.on("message", (message) => {
    const request = JSON.parse(message);

    if (request.type === "spot") {
      // Client requested Spot data
      console.log("Client requested Spot data");
      spotSocket = new WebSocket(spotStreamUrl);

      spotSocket.on("open", () => {
        console.log("Connected to Binance Spot WebSocket stream");
      });

      spotSocket.on("message", (data) => {
        const parsedData = JSON.parse(data);
        const message = parsedData.data;
        const price = message.c;
        const symbol = message.s;

        socket.send(JSON.stringify({ type: "spot", symbol, price }));
      });

      spotSocket.on("error", (error) => {
        console.error("Spot WebSocket error:", error);
      });
    } else if (request.type === "futures") {
      // Client requested Futures data
      console.log("Client requested Futures data");
      futuresSocket = new WebSocket(futuresStreamUrl);

      futuresSocket.on("open", () => {
        console.log("Connected to Binance Futures WebSocket stream");
      });

      futuresSocket.on("message", (data) => {
        const parsedData = JSON.parse(data);
        const message = parsedData.data;
        const price = message.c;
        const symbol = message.s;

        socket.send(JSON.stringify({ type: "futures", symbol, price }));
      });

      futuresSocket.on("error", (error) => {
        console.error("Futures WebSocket error:", error);
      });
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");

    if (spotSocket) spotSocket.close();
    if (futuresSocket) futuresSocket.close();
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
