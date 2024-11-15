const axios = require("axios");

class CryptoAPIService {
  async fetchCandles(symbol, interval, limit) {
    try {
      // CryptoCompare API endpoint
      const url = `https://min-api.cryptocompare.com/data/v2/histoday`;

      // Set up query parameters
      const params = {
        fsym: symbol, // Symbol for the cryptocurrency (e.g., BTC)
        tsym: "USDT", // Currency symbol (e.g., USD or USDT)
        limit: limit, // Limit the number of results
        toTs: Math.floor(Date.now() / 1000), // Current timestamp (optional)
        e: "Binance", // Exchange (Binance is one of the options)
      };

      // Add an interval-based filter if needed (CryptoCompare API uses daily data in histoday)
      if (interval) {
        params.interval = interval;
      }

      // Make the GET request to CryptoCompare API
      const response = await axios.get(url, { params });

      if (response.data && response.data.Data && response.data.Data.Data) {
        // Format the candlestick data
        const candles = response.data.Data.Data.map((candle) => ({
          timestamp: candle.time * 1000, // Convert from seconds to milliseconds
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));

        console.log("Data fetched successfully:", candles);
        return candles; // Return candlestick data
      } else {
        console.error("No data received from CryptoCompare");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from CryptoCompare:", error.message);
      throw error; // Re-throw error for further handling
    }
  }
}

module.exports = CryptoAPIService;
