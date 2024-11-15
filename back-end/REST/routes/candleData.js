const axios = require("axios");

class CryptoAPIService {
  // Fetch candlestick data from Binance
  async fetchCandles(symbol, interval, limit) {
    try {
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

      // Make a GET request to Binance API
      const response = await axios.get(url);

      // Check if data is received
      if (response.data && response.data.length > 0) {
        console.log("Data fetched successfully:", response.data);
        return response.data; // Return candlestick data
      } else {
        console.error("No data received from Binance");
        return null;
      }
    } catch (error) {
      // Handle specific error codes
      if (error.response && error.response.status === 451) {
        console.error("Error: Legal reasons or geo-blocking. Request blocked.");
      } else {
        console.error("Error fetching data from Binance:", error.message);
      }
      throw error; // Re-throw the error for further handling
    }
  }
}

module.exports = CryptoAPIService;
