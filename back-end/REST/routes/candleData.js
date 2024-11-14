// CryptoAPIService.js
const axios = require("axios");

class CryptoAPIService {
  async fetchCandles(symbol, interval, limit) {
    try {
      const url = `https://minus1-backend.onrender.com/api/candles?symbol=${symbol}&interval=${interval}&limit=${limit}`;

      // Make a GET request
      const response = await axios.get(url);

      // Check if data is received
      if (response.data) {
        console.log("Data fetched successfully:", response.data);
        return response.data; // Return candle data
      } else {
        console.error("No data received");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      throw error; // Re-throw the error for further handling if needed
    }
  }
}

module.exports = CryptoAPIService;
