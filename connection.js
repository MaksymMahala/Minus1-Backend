const express = require("express");
const axios = require("axios");
const WebSocket = require("ws");
const cors = require("cors");
const expressWs = require("express-ws"); // Import express-ws

const app = express();
expressWs(app); // Initialize express-ws with your app

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

class CryptoAPIService {
  constructor() {
    this.baseURL = "https://api.binance.com";
  }

  // Fetch historical candlestick data
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

// Endpoint to start a WebSocket connection
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
