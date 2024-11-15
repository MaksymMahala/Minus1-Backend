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
const CryptoAPIService = require("./routes/candleData");

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

const cryptoAPIService = new CryptoAPIService();

app.get("/api/candles", async (req, res) => {
  const { symbol, interval, limit } = req.query;

  if (!symbol || !interval || !limit) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const candles = await cryptoAPIService.fetchCandles(
      symbol,
      interval,
      parseInt(limit)
    );

    if (candles) {
      res.status(200).json(candles); // Send candlestick data in the response
    } else {
      res.status(500).json({ error: "No candlestick data found" });
    }
  } catch (error) {
    console.error("Error fetching candlestick data:", error.message);
    res.status(500).json({ error: "Error fetching candlestick data" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: true, message: "Internal Server Error" });
});

//MARK: Prices by symbol -----> !!!!!
app.get("/api/prices/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase(); // Extract symbol from request params

  // Check if the symbol is valid
  if (!pricesArray.has(symbol)) {
    return res.status(400).json({ error: "Invalid symbol" });
  }

  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );

    // Return the price for the requested symbol
    res.json({
      symbol: response.data.symbol,
      price: response.data.price,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching price" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
