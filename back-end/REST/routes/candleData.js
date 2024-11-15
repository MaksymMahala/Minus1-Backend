const axios = require("axios");

class CryptoAPIService {
  async fetchCandles(symbol, interval, limit) {
    try {
      let url = "";
      let params = {
        fsym: symbol, // Symbol for the cryptocurrency (e.g., BTC)
        tsym: "USDT", // Currency symbol (e.g., USD or USDT)
        limit: limit, // Limit the number of results
        toTs: Math.floor(Date.now() / 1000), // Current timestamp (optional)
        e: "Binance", // Exchange (Binance is one of the options)
      };

      // Determine the correct endpoint and interval type
      switch (interval) {
        case "sec":
          url = `https://min-api.cryptocompare.com/data/v2/histosec`; // For second-level data
          break;
        case "minute":
          url = `https://min-api.cryptocompare.com/data/v2/histominute`; // For minute-level data
          break;
        case "hour":
          url = `https://min-api.cryptocompare.com/data/v2/histohour`; // For hourly data
          break;
        case "day":
          url = `https://min-api.cryptocompare.com/data/v2/histoday`; // For daily data
          break;
        case "week":
          params.limit = Math.min(limit, 52); // Set a reasonable limit of 52 weeks
          url = `https://min-api.cryptocompare.com/data/v2/histoday`;
          break;
        case "month":
          params.limit = Math.min(limit, 12); // Set a reasonable limit of 12 months
          url = `https://min-api.cryptocompare.com/data/v2/histoday`;
          break;
        case "year":
          params.limit = Math.min(limit, 730); // Set a reasonable limit of 730 days (approximately 2 years)
          url = `https://min-api.cryptocompare.com/data/v2/histoday`;
          break;
        default:
          throw new Error(`Unsupported interval: ${interval}`);
      }

      // Make the GET request to CryptoCompare API
      const response = await axios.get(url, { params });

      // Check if the response contains the expected data
      if (response.data && response.data.Data && response.data.Data.Data) {
        // Format the candlestick data with additional properties
        const candles = response.data.Data.Data.map((candle) => ({
          openTime: new Date(candle.time * 1000), // Convert from seconds to milliseconds
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volumefrom || 0, // Assuming `volumefrom` represents base asset volume
          closeTime: new Date((candle.time + 86400) * 1000), // Add 1 day for closeTime (if using daily data)
          quoteAssetVolume: candle.volumeto || 0, // Assuming `volumeto` represents quote asset volume
          numberOfTrades: candle.trades || 0, // Assuming `trades` represents the number of trades
          takerBuyBaseAssetVolume: candle.takerBuyBaseAssetVolume || 0, // Example field, might need adjustment
          takerBuyQuoteAssetVolume: candle.takerBuyQuoteAssetVolume || 0, // Example field, might need adjustment
        }));

        console.log("Data fetched successfully:", candles);
        return candles; // Return formatted candlestick data
      } else {
        console.error("No data received from CryptoCompare");
        return null; // Return null if no data is received
      }
    } catch (error) {
      console.error("Error fetching data from CryptoCompare:", error.message);

      // Log more detailed error information for debugging
      if (error.response) {
        console.error("API Response Error:", error.response.data);
        console.error("API Response Status:", error.response.status);
      } else if (error.request) {
        console.error("API Request Error:", error.request);
      } else {
        console.error("General Error:", error.message);
      }

      throw error; // Re-throw error for further handling if necessary
    }
  }
}

module.exports = CryptoAPIService;
