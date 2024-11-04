const express = require("express");
const cors = require("cors");
const axios = require("axios");
const WebSocket = require("ws");
const expressWs = require("express-ws");
const mongoose = require("mongoose");

const {
  recentCryptoCurrencySymbols,
  topCryptoCurrencySymbols,
} = require("../Constants/compressCryptoSymbols");
const { loadCryptocurrencies } = require("../Constants/JSONReader");
const register = require("./routes/register");
const login = require("./routes/login");
const lastPrices = require("./routes/last-prices");

const PORT = 5500;

const app = express();
expressWs(app); // Initialize express-ws with your app

mongoose
  .connect(
    "mongodb+srv://maximmagala:ESCVb1cwYzyixVNE@minus1.qlylc.mongodb.net/?retryWrites=true&w=majority&appName=Minus1",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Cryptocurrency API. Use /api/cryptocurrencies to get data."
  );
});

// Cryptocurrency routes
app.get("/api/cryptocurrencies", async (req, res) => {
  try {
    const cryptocurrencies = await loadCryptocurrencies();
    if (cryptocurrencies.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No cryptocurrencies found" });
    }
    res.status(200).json(cryptocurrencies);
  } catch (error) {
    console.error("Error loading cryptocurrencies:", error);
    res
      .status(500)
      .json({ error: true, message: "Error loading cryptocurrencies" });
  }
});

// Recent and top cryptocurrencies
app.get("/api/recent-cryptocurrencies", async (req, res) => {
  const cryptocurrencies = await loadCryptocurrencies();
  const recentCryptos = cryptocurrencies.filter((crypto) =>
    recentCryptoCurrencySymbols.has(crypto.symbol)
  );
  res.status(200).json(recentCryptos);
});

app.get("/api/top-cryptocurrencies", async (req, res) => {
  const cryptocurrencies = await loadCryptocurrencies();
  const topCryptos = cryptocurrencies.filter((crypto) =>
    topCryptoCurrencySymbols.has(crypto.symbol)
  );
  res.status(200).json(topCryptos);
});

app.get("/api/cryptocurrency/:symbol", async (req, res) => {
  const cryptocurrencies = await loadCryptocurrencies();
  const { symbol } = req.params;
  const crypto = cryptocurrencies.find(
    (c) => c.symbol === symbol.toUpperCase()
  );

  if (crypto) {
    res.status(200).json({
      symbol: crypto.symbol,
      name: crypto.name,
      id: crypto.id,
      icon: crypto.icon,
    });
  } else {
    res.status(404).json({ error: true, message: "Cryptocurrency not found" });
  }
});

// Authentication routes
app.use("/api", register);
app.use("/api", login);
app.use("/api", lastPrices);

// Crypto API service for candlestick data
class CryptoAPIService {
  constructor() {
    this.baseURL = "https://api.binance.com";
  }

  async fetchCandlestickData(symbol, interval, limit = 500) {
    try {
      const response = await axios.get(`${this.baseURL}/api/v3/klines`, {
        params: {
          symbol: symbol.toUpperCase(),
          interval: interval,
          limit: limit,
        },
      });

      return response.data.map((apiCandle) => ({
        openTime: new Date(apiCandle[0]),
        open: parseFloat(apiCandle[1]),
        high: parseFloat(apiCandle[2]),
        low: parseFloat(apiCandle[3]),
        close: parseFloat(apiCandle[4]),
        volume: parseFloat(apiCandle[5]),
        closeTime: new Date(apiCandle[6]),
        quoteAssetVolume: parseFloat(apiCandle[7]),
        numberOfTrades: apiCandle[8],
        takerBuyBaseAssetVolume: parseFloat(apiCandle[9]),
        takerBuyQuoteAssetVolume: parseFloat(apiCandle[10]),
      }));
    } catch (error) {
      throw new Error(`Error fetching candlestick data: ${error.message}`);
    }
  }
}

// Create an instance of the API service
const cryptoService = new CryptoAPIService();

// Store last candle for each symbol and interval
const lastCandles = {};

// Endpoint to fetch historical candlestick data
app.get("/api/candles", async (req, res) => {
  const { symbol, interval, limit } = req.query;

  if (!symbol || !interval) {
    return res
      .status(400)
      .json({ error: "Missing required parameters: symbol and interval" });
  }

  try {
    const candles = await cryptoService.fetchCandlestickData(
      symbol,
      interval,
      limit
    );
    return res.json(candles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// WebSocket endpoint for candlestick updates
app.ws("/api/candlestick-stream/:symbol/:interval", (ws, req) => {
  const { symbol, interval } = req.params;
  const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;
  const socket = new WebSocket(wsUrl);

  socket.on("open", () => {
    console.log(
      `Subscribed to candlestick updates for ${symbol} at interval ${interval}`
    );
  });

  socket.on("message", (data) => {
    const message = JSON.parse(data);
    const kline = message.k;

    if (kline) {
      const candle = {
        openTime: new Date(kline.t),
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
        volume: parseFloat(kline.v),
        closeTime: new Date(kline.T),
        quoteAssetVolume: parseFloat(kline.q),
        numberOfTrades: kline.n,
        takerBuyBaseAssetVolume: parseFloat(kline.V),
        takerBuyQuoteAssetVolume: parseFloat(kline.Q),
      };

      // Update the last candle for this symbol and interval
      lastCandles[`${symbol}_${interval}`] = candle;

      // Send the updated candle data to the WebSocket client
      ws.send(JSON.stringify(candle));
    }
  });

  socket.on("error", (error) => {
    console.error(`WebSocket error: ${error.message}`);
    ws.close();
  });

  socket.on("close", () => {
    console.log("WebSocket connection closed");
    ws.close();
  });

  ws.on("close", () => {
    console.log("WebSocket client connection closed");
    socket.close();
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: true, message: "Internal Server Error" });
});

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

const spotStreams = spotSymbols.map((symbol) => `${symbol}@ticker`).join("/");
const spotStreamUrl = `wss://stream.binance.com:9443/stream?streams=${spotStreams}`;

const futuresStreams = futuresSymbols
  .map((symbol) => `${symbol}@ticker`)
  .join("/");
const futuresStreamUrl = `wss://fstream.binance.com/stream?streams=${futuresStreams}`;

// WebSocket connection handler for trading streams
app.ws("/api/trading-stream", (socket, req) => {
  console.log("Client connected to trading stream");

  let spotSocket, futuresSocket;

  socket.on("message", (message) => {
    try {
      const request = JSON.parse(message);

      if (request.type === "spot") {
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
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");

    if (spotSocket) spotSocket.close();
    if (futuresSocket) futuresSocket.close();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
