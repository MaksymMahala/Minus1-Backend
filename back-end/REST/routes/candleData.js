const axios = require("axios");

class CryptoAPIService {
  async fetchCandles(symbol, interval, limit) {
    try {
      // CoinGecko API endpoint with the necessary parameters
      const url = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=${limit}&interval=${interval}`;

      // If API key is required, add it to the headers
      const response = await axios.get(url, {
        headers: {
          Authorization: "Bearer CG-ihZ3z57st7v4uH98rhiY9BWK", // Replace with your API key
        },
      });

      if (response.data && response.data.prices) {
        console.log("Data fetched successfully:", response.data.prices);
        return response.data.prices; // Return candlestick data
      } else {
        console.error("No data received from CoinGecko");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from CoinGecko:", error.message);
      throw error; // Re-throw error for further handling
    }
  }
}

module.exports = CryptoAPIService;
