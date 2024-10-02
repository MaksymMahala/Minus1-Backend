const express = require("express");
const cors = require("cors");
const {
  recentCryptoCurrencySymbols,
  topCryptoCurrencySymbols,
} = require("../Constants/compressCryptoSymbols");
const { cryptocurrencies } = require("../Constants/AllSymbols");

require("dotenv").config();
const PORT = process.env.PORT || 5500;

const app = express();
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/cryptocurrencies", (req, res) => {
  res.status(200).json(cryptocurrencies);
});

app.get("/api/recent-cryptocurrencies", (req, res) => {
  const recentCryptos = cryptocurrencies.filter((crypto) =>
    recentCryptoCurrencySymbols.has(crypto.symbol)
  );
  res.status(200).json(recentCryptos);
});

app.get("/api/top-cryptocurrencies", (req, res) => {
  const topCryptos = cryptocurrencies.filter((crypto) =>
    topCryptoCurrencySymbols.has(crypto.symbol)
  );
  res.status(200).json(topCryptos);
});

//-----> on symbol api
app.get("/api/cryptocurrency/:symbol", (req, res) => {
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: true, message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
