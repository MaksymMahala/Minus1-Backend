const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const expressWs = require("express-ws");
const mongoose = require("mongoose");

const {
  recentCryptoCurrencySymbols,
  topCryptoCurrencySymbols,
} = require("./back-end/Constants/compressCryptoSymbols");
const { loadCryptocurrencies } = require("./back-end/Constants/JSONReader");
const register = require("./back-end/REST/routes/register");
const login = require("./back-end/REST/routes/login");
const lastPrices = require("./back-end/REST/routes/last-prices");
const editProfile = require("./back-end/REST/routes/edit-profile");
const getClientData = require("./back-end/REST/routes/getClientData");
const CryptoAPIService = require("./back-end/REST/routes/candleData");
const cryptoAPIService = new CryptoAPIService();

const PORT = 5500;

const app = express();
expressWs(app);
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: true, message: "Internal Server Error" });
});
app.use("/api", register);
app.use("/api", login);
app.use("/api", lastPrices);
app.use("/api", editProfile);
app.use("/api", getClientData);

const dbURI =
  "mongodb+srv://maximmagala:ESCVb1cwYzyixVNE@minus1.qlylc.mongodb.net/?retryWrites=true&w=majority&appName=Minus1";

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ error: "Please provide 'from', 'to', and 'amount' parameters" });
  }

  try {
    // Fetch the conversion rate from Binance API
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${from}${to}`
    );
    const conversionRate = parseFloat(response.data.price);

    // Calculate the converted amount
    const convertedAmount = parseFloat(amount) * conversionRate;

    res.status(200).json({
      from,
      to,
      amount: parseFloat(amount),
      conversionRate,
      convertedAmount,
    });
  } catch (error) {
    console.error("Error fetching conversion rate:", error.message);

    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "Invalid cryptocurrency pair" });
    }

    res.status(500).json({ error: "An error occurred during conversion" });
  }
});

app.use(cors());

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

async function getCryptoLastPrice(symbol) {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price`,
      {
        params: { symbol: symbol },
      }
    );
    return response.data.price; // Return the last price
  } catch (error) {
    console.error("Error fetching price for symbol:", symbol, error);
    throw new Error("Failed to fetch price from Binance");
  }
}

// Route to get all cryptocurrencies with last price
app.get("/api/cryptocurrencies", async (req, res) => {
  try {
    const cryptocurrencies = await loadCryptocurrencies();
    if (cryptocurrencies.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No cryptocurrencies found" });
    }

    // Adding last price and other fields
    const cryptocurrenciesWithDetails = await Promise.all(
      cryptocurrencies.map(async (crypto) => {
        const lastPrice = await getCryptoLastPrice(crypto.symbol);
        return {
          id: crypto.id, // Ensure `id` is available in `crypto`
          name: crypto.name, // Ensure `name` is available in `crypto`
          symbol: crypto.symbol,
          price: lastPrice, // Add last price as `price`
          icon: crypto.icon || "", // Provide a default or use an available `icon` field
        };
      })
    );

    res.status(200).json(cryptocurrenciesWithDetails);
  } catch (error) {
    console.error("Error loading cryptocurrencies:", error);
    res
      .status(500)
      .json({ error: true, message: "Error loading cryptocurrencies" });
  }
});

app.get("/api/recent-cryptocurrencies", async (req, res) => {
  try {
    const cryptocurrencies = await loadCryptocurrencies();
    const recentCryptos = cryptocurrencies.filter((crypto) =>
      recentCryptoCurrencySymbols.has(crypto.symbol)
    );

    // Adding last price and other fields
    const recentCryptosWithDetails = await Promise.all(
      recentCryptos.map(async (crypto) => {
        const lastPrice = await getCryptoLastPrice(crypto.symbol);
        return {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price: lastPrice,
          icon: crypto.icon || "",
        };
      })
    );

    res.status(200).json(recentCryptosWithDetails);
  } catch (error) {
    console.error("Error loading recent cryptocurrencies:", error);
    res
      .status(500)
      .json({ error: true, message: "Error loading recent cryptocurrencies" });
  }
});
app.get("/api/top-cryptocurrencies", async (req, res) => {
  try {
    const cryptocurrencies = await loadCryptocurrencies();
    const topCryptos = cryptocurrencies.filter((crypto) =>
      topCryptoCurrencySymbols.has(crypto.symbol)
    );

    // Adding last price and other fields
    const topCryptosWithDetails = await Promise.all(
      topCryptos.map(async (crypto) => {
        const lastPrice = await getCryptoLastPrice(crypto.symbol);
        return {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          price: lastPrice,
          icon: crypto.icon || "",
        };
      })
    );

    res.status(200).json(topCryptosWithDetails);
  } catch (error) {
    console.error("Error loading top cryptocurrencies:", error);
    res
      .status(500)
      .json({ error: true, message: "Error loading top cryptocurrencies" });
  }
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

app.get("/api/candles", async (req, res) => {
  const { symbol, interval, limit } = req.query;

  // Check for missing parameters
  if (!symbol || !interval || !limit) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Fetch candlestick data from the CryptoAPIService
    const candles = await cryptoAPIService.fetchCandles(
      symbol,
      interval,
      parseInt(limit)
    );

    // Check if the data exists
    if (candles && candles.length > 0) {
      res.status(200).json(candles); // Send the fetched candlestick data in the response
    } else {
      console.error(
        `No candlestick data found for ${symbol} with interval ${interval} and limit ${limit}`
      );
      res.status(500).json({ error: "No candlestick data found" });
    }
  } catch (error) {
    console.error("Error fetching candlestick data:", error.message);

    // Log more information for debugging
    if (error.response) {
      console.error("API Response Error:", error.response.data); // Detailed error from API response
      console.error("API Response Status:", error.response.status); // Status code
    } else if (error.request) {
      console.error("API Request Error:", error.request); // Request info if no response is received
    } else {
      console.error("General Error:", error.message); // Other errors
    }

    res.status(500).json({ error: "Error fetching candlestick data" });
  }
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
