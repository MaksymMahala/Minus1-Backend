const fs = require("fs").promises;
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
    return cryptocurrencies;
  } catch (err) {
    console.error("Error reading the file:", err.message);
    return [];
  }
}

module.exports = { loadCryptocurrencies };
