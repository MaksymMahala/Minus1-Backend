const fs = require("fs").promises; // Use promises API from fs module
const path = require("path");

async function loadCryptocurrencies() {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "../JSON/symbols.json"),
      "utf8"
    );

    if (!data) {
      throw new Error("The file is empty");
    }

    const cryptocurrencies = JSON.parse(data);
    console.log("Raw data read from file:", cryptocurrencies);
    return cryptocurrencies; // Return the loaded data
  } catch (err) {
    console.error("Error reading the file:", err.message);
    return []; // Return the loaded data
  }
}

module.exports = { loadCryptocurrencies };
