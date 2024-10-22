const express = require("express");
const axios = require("axios");
const router = express.Router();

const spotSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "LTCUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "DOTUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "TRXUSDT",
  "SHIBUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "XLMUSDT",
  "FILUSDT",
  "LUNAUSDT",
  "ICPUSDT",
  "NEARUSDT",
  "VETUSDT",
  "THETAUSDT",
  "EOSUSDT",
  "AAVEUSDT",
  "SANDUSDT",
  "MANAUSDT",
  "ZILUSDT",
  "QTUMUSDT",
  "BATUSDT",
  "ENJUSDT",
  "CHZUSDT",
  "DGBUSDT",
  "DASHUSDT",
  "NANOUSDT",
  "ZRXUSDT",
  "WAVESUSDT",
  "KSMUSDT",
  "BTTUSDT",
  "YFIUSDT",
  "GRTUSDT",
];

const axiosInstance = axios.create({
  headers: {
    "X-MBX-APIKEY":
      "KKrBBISLbpC5CYgQIiRQj0MULTLAlChCkorxIHLRhMXdibSap9HEEvKTly3kp4CF",
  },
});

router.get("/last-week-prices", async (req, res) => {
  try {
    const promises = spotSymbols.map((symbol) =>
      axiosInstance.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=7`
      )
    );

    const responses = await Promise.all(promises);

    const lastWeekPrices = {};
    responses.forEach((response, index) => {
      const symbol = spotSymbols[index];
      const prices = response.data.map((entry) => ({
        openTime: new Date(entry[0]),
        open: parseFloat(entry[1]),
        high: parseFloat(entry[2]),
        low: parseFloat(entry[3]),
        close: parseFloat(entry[4]),
        volume: parseFloat(entry[5]),
      }));
      lastWeekPrices[symbol] = prices;
    });

    res.json(lastWeekPrices);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch historical prices" });
  }
});

router.get("/last-day-prices", async (req, res) => {
  try {
    const promises = spotSymbols.map((symbol) =>
      axiosInstance.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`
      )
    );

    const responses = await Promise.all(promises);

    const lastDayPrices = {};
    responses.forEach((response, index) => {
      const symbol = spotSymbols[index];
      const prices = response.data.map((entry) => ({
        openTime: new Date(entry[0]),
        open: parseFloat(entry[1]),
        high: parseFloat(entry[2]),
        low: parseFloat(entry[3]),
        close: parseFloat(entry[4]),
        volume: parseFloat(entry[5]),
      }));
      lastDayPrices[symbol] = prices;
    });

    res.json(lastDayPrices);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch last day prices" });
  }
});

module.exports = router;
