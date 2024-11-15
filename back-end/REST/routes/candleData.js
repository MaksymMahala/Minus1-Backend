const axios = require("axios");

class CryptoAPIService {
  async fetchCandles(symbol, interval, limit) {
    try {
      // Binance API endpoint for candlestick data
      const url = `https://api.binance.com/api/v3/klines`;

      // Set up the query parameters
      const params = {
        symbol: symbol.toUpperCase(), // Convert symbol to uppercase (e.g. BTCUSDT)
        interval: interval, // Interval such as '1m', '5m', '1h', etc.
        limit: limit, // Limit the number of results (e.g. 5)
      };

      // Make the API request to Binance
      const response = await axios.get(url, { params });

      if (response.data) {
        // Map the data into the format you need (timestamp, open, close, high, low)
        const candles = response.data.map((candle) => {
          return {
            timestamp: candle[0], // Timestamp (in milliseconds)
            open: parseFloat(candle[1]), // Open price
            high: parseFloat(candle[2]), // High price
            low: parseFloat(candle[3]), // Low price
            close: parseFloat(candle[4]), // Close price
          };
        });

        console.log("Data fetched successfully:", candles);
        return candles; // Return candlestick data
      } else {
        console.error("No data received from Binance");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from Binance:", error.message);
      throw error; // Re-throw error for further handling
    }
  }
}

module.exports = CryptoAPIService;
