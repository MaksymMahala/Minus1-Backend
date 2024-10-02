// const WebSocket = require("ws");

// const server = new WebSocket.Server({ port: 8080 });

// server.on("connection", (socket) => {
//   console.log("Client connected");

//   const symbols = [
//     "btcusdt",
//     "ethusdt",
//     "bnbusdt",
//     "xrpusdt",
//     "ltcusdt",
//     "adausdt",
//     "solusdt",
//     "dotusdt",
//     "dogeusdt",
//     "maticusdt",
//     "trxusdt",
//     "shibusdt",
//     "avaxusdt",
//     "linkusdt",
//     "xlmusdt",
//     "filusdt",
//     "lunausdt",
//     "etusdt",
//     "icpusdt",
//     "nearusdt",
//     "vetusdt",
//     "thetausdt",
//     "eosusdt",
//     "aaveusdt",
//     "sandusdt",
//     "manausdt",
//     "zilusdt",
//     "qtumusdt",
//     "batusdt",
//     "enjusdt",
//     "chzusdt",
//     "dgbusdt",
//     "dashusdt",
//     "nanousdt",
//     "zrxusdt",
//     "wavesusdt",
//     "ksmusdt",
//     "bttusdt",
//     "yfiusdt",
//     "grtusdt",
//   ];

//   // Create the WebSocket stream URL for all symbols
//   const streamUrl = `wss://stream.binance.com:9443/ws/${symbols.join(
//     "@ticker/"
//   )}`;

//   // Connect to the Binance WebSocket stream
//   const priceSocket = new WebSocket(streamUrl);

//   priceSocket.on("open", () => {
//     console.log("Connected to Binance WebSocket stream");
//   });

//   priceSocket.on("message", (data) => {
//     const message = JSON.parse(data);
//     const price = message.c; // Last price
//     const symbol = message.s; // Symbol

//     // Send the price to the connected client
//     socket.send(JSON.stringify({ symbol, price }));
//     console.log(`Price: ${price} Symbol: ${symbol}`);
//   });

//   priceSocket.on("error", (error) => {
//     console.error("WebSocket error:", error);
//   });

//   socket.on("close", () => {
//     console.log("Client disconnected");
//     priceSocket.close();
//   });
// });

// console.log("WebSocket server is running on ws://localhost:8080");

//------------Active!

// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const Web3 = require("web3").default;
// const axios = require("axios");
// const RippleAPI = require("ripple-lib").RippleAPI;
// const StellarSdk = require("stellar-sdk");
// const { ApiPromise, WsProvider } = require("@polkadot/api");
// const { Server } = require("engine.io");

// // Ініціалізація Express та Socket.IO
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Підключення до Ethereum вузла (замініть на ваш Infura Project ID)
// const web3 = new Web3(
//   new Web3.providers.WebsocketProvider(
//     "wss://mainnet.infura.io/ws/v3/6f7c32a1ce4d4bfd82b4b941bc79d60e"
//   )
// );

// // Підключення до Ripple (XRP)
// const rippleAPI = new RippleAPI({ server: "wss://s1.ripple.com" });

// // Підключення до Stellar (XLM)
// // const stellarServer = new StellarSdk.Server("https://horizon.stellar.org");

// // Функція для відстеження нових блоків Ethereum
// const trackEthereum = () => {
//   web3.eth.subscribe("newBlockHeaders", (error, blockHeader) => {
//     if (!error) {
//       web3.eth
//         .getBlock(blockHeader.number, true)
//         .then((block) => {
//           io.emit("newBlock", { coin: "ETH", block });
//           console.log(`Новий блок ETH: ${block.number}`);
//         })
//         .catch((err) => console.error("Помилка при отриманні блоку ETH:", err));
//     } else {
//       console.error("Помилка підписки ETH:", error);
//     }
//   });
// };

// // Функція для відстеження нових блоків Bitcoin (BTC) за допомогою blockchain.info API
// let lastBitcoinBlockHeight = 0; // Store the last known Bitcoin block height
// let lastBCHBlockHeight = 0; // Store the last known BCH block height
// let lastLTCBlockHeight = 0; // Store the last known LTC block height

// const trackBitcoin = () => {
//   const bitcoinApiUrl = "https://blockchain.info/latestblock";
//   const priceApiUrl =
//     "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin,bitcoin-cash&vs_currencies=usd";

//   const fetchLatestBlock = async () => {
//     try {
//       const response = await axios.get(bitcoinApiUrl);
//       const latestBlock = response.data;

//       // Log the latest block height for debugging
//       console.log(`Latest Block Height from API: ${latestBlock.height}`);

//       if (latestBlock.height !== lastBitcoinBlockHeight) {
//         lastBitcoinBlockHeight = latestBlock.height;
//         const prices = await fetchPrices(); // Fetch prices
//         io.emit("newBlock", {
//           coin: "BTC",
//           block: latestBlock,
//           price: prices.bitcoin.usd,
//         });
//         console.log(
//           `Новий блок BTC: ${latestBlock.height}, Ціна: $${prices.bitcoin.usd}`
//         );
//       }
//     } catch (error) {
//       console.error("Помилка при отриманні блоку BTC:", error);
//     }
//   };

//   const fetchPrices = async () => {
//     try {
//       const response = await axios.get(priceApiUrl);
//       return response.data; // Return the price data
//     } catch (error) {
//       console.error("Помилка при отриманні цін:", error);
//       return {};
//     }
//   };

//   // Initial fetch
//   fetchLatestBlock();

//   // Check every 2 seconds
//   setInterval(fetchLatestBlock, 60000);
// };

// // Функція для відстеження нових транзакцій Ripple (XRP)
// const trackRipple = () => {
//   rippleAPI
//     .connect()
//     .then(() => {
//       console.log("Підключено до Ripple");
//       rippleAPI.on("transaction", (transaction) => {
//         io.emit("newBlock", { coin: "XRP", transaction });
//         console.log("Нова транзакція XRP:", transaction);
//       });
//     })
//     .catch(console.error);
// };

// // Функція для відстеження нових платежів Stellar (XLM)
// // const trackStellar = () => {
// //   const stream = stellarServer
// //     .payments()
// //     .forAccount("YOUR_STELLAR_ACCOUNT_ID") // Замініть на ваш Stellar Account ID або інший параметр фільтрації
// //     .stream({
// //       onmessage: (payment) => {
// //         io.emit("newBlock", { coin: "XLM", payment });
// //         console.log("Нове платеж XRP:", payment);
// //       },
// //       onerror: (error) => {
// //         console.error("Помилка Stellar:", error);
// //       },
// //     });
// // };

// // Функція для відстеження Cardano (ADA) за допомогою Blockfrost
// // const trackCardano = () => {
// //   const blockfrostApiKey = "YOUR_BLOCKFROST_API_KEY"; // Замініть на ваш Blockfrost API Key
// //   const cardanoApiUrl =
// //     "https://cardano-mainnet.blockfrost.io/api/v0/latest/block";

// //   const fetchLatestBlock = async () => {
// //     try {
// //       const response = await axios.get(cardanoApiUrl, {
// //         headers: { project_id: blockfrostApiKey },
// //       });
// //       const latestBlock = response.data;

// //       io.emit("newBlock", { coin: "ADA", block: latestBlock });
// //       console.log(`Новий блок ADA: ${latestBlock.slot}`);
// //     } catch (error) {
// //       console.error("Помилка при отриманні блоку ADA:", error);
// //     }
// //   };

// //   // Початкова ініціалізація
// //   fetchLatestBlock();

// //   // Перевіряти кожні 60 секунд
// //   setInterval(fetchLatestBlock, 60000);
// // };

// // Функція для відстеження Polkadot (DOT)
// const trackPolkadot = async () => {
//   try {
//     const wsProvider = new WsProvider("wss://rpc.polkadot.io");
//     const api = await ApiPromise.create({ provider: wsProvider });

//     api.rpc.chain.subscribeNewHeads((lastHeader) => {
//       io.emit("newBlock", { coin: "DOT", block: lastHeader.toHuman() });
//       console.log(`Новий блок DOT: #${lastHeader.number}`);
//     });
//   } catch (error) {
//     console.error("Помилка при підключенні до Polkadot:", error);
//   }
// };

// // Функція для відстеження Dogecoin (DOGE) за допомогою Dogechain API
// // let lastDogecoinBlockHeight = 0; // Зберігає останній відомий блок

// // const trackDogecoin = () => {
// //   const dogeApiUrl = "https://dogechain.info/api/v1/block/last";

// //   const fetchLatestBlock = async () => {
// //     try {
// //       const response = await axios.get(dogeApiUrl, {
// //         headers: {
// //           // Uncomment the line below if an API key is needed
// //           // 'Authorization': `Bearer YOUR_API_KEY`,
// //           "User-Agent": "YourAppName/1.0", // Add a User-Agent header if needed
// //         },
// //       });
// //       const latestBlock = response.data;

// //       if (latestBlock.block_height !== lastDogecoinBlockHeight) {
// //         lastDogecoinBlockHeight = latestBlock.block_height;
// //         io.emit("newBlock", { coin: "DOGE", block: latestBlock });
// //         console.log(`Новий блок DOGE: ${latestBlock.block_height}`);
// //       }
// //     } catch (error) {
// //       console.error("Помилка при отриманні блоку DOGE:", error);
// //     }
// //   };

// //   // Початкова ініціалізація
// //   fetchLatestBlock();

// //   // Перевіряти кожні 60 секунд
// //   setInterval(fetchLatestBlock, 60000);
// // };

// // Функція для відстеження Litecoin (LTC) за допомогою blockchain.info API
// let lastLitecoinBlockHeight = 0; // Зберігає останній відомий блок

// const trackLitecoin = () => {
//   const ltcApiUrl = "https://blockchain.info/latestblock?cors=true";

//   const fetchLatestBlock = async () => {
//     try {
//       const response = await axios.get(ltcApiUrl);
//       const latestBlock = response.data;

//       if (latestBlock.height !== lastLitecoinBlockHeight) {
//         lastLitecoinBlockHeight = latestBlock.height;
//         io.emit("newBlock", { coin: "LTC", block: latestBlock });
//         console.log(`Новий блок LTC: ${latestBlock.height}`);
//       }
//     } catch (error) {
//       console.error("Помилка при отриманні блоку LTC:", error);
//     }
//   };

//   // Початкова ініціалізація
//   fetchLatestBlock();

//   // Перевіряти кожні 60 секунд
//   setInterval(fetchLatestBlock, 60000);
// };

// // Функція для відстеження Bitcoin Cash (BCH) за допомогою Blockchair API
// let lastBitcoinCashBlockID = "";

// const trackBitcoinCash = () => {
//   const bchApiUrl = "https://api.blockchair.com/bitcoin-cash/blocks?limit=1";

//   const fetchLatestBlock = async () => {
//     try {
//       const response = await axios.get(bchApiUrl);
//       const latestBlock = response.data.data[0];

//       if (latestBlock.id !== lastBitcoinCashBlockID) {
//         lastBitcoinCashBlockID = latestBlock.id;
//         io.emit("newBlock", { coin: "BCH", block: latestBlock });
//         console.log(`Новий блок BCH: ${latestBlock.id}`);
//       }
//     } catch (error) {
//       console.error("Помилка при отриманні блоку BCH:", error);
//     }
//   };

//   // Початкова ініціалізація
//   fetchLatestBlock();

//   // Перевіряти кожні 60 секунд
//   setInterval(fetchLatestBlock, 60000);
// };

// // Функція для відстеження Chainlink (LINK) на Ethereum
// // Для спрощення ми відстежуватимемо події смарт-контракту Chainlink
// const trackChainlink = () => {
//   const chainlinkContractAddress = "0x514910771AF9Ca656af840dff83E8264EcF986CA"; // Замініть на актуальну адресу контракту Chainlink
//   const chainlinkAbi = [
//     /* ABI контракту Chainlink */
//   ];

//   const chainlinkContract = new web3.eth.Contract(
//     chainlinkAbi,
//     chainlinkContractAddress
//   );

//   // Приклад відстеження подій (замініть 'YourEvent' на реальну подію)
//   chainlinkContract.events
//     .YourEvent({
//       fromBlock: "latest",
//     })
//     .on("data", (event) => {
//       io.emit("newBlock", { coin: "LINK", event });
//       console.log("Нова подія Chainlink:", event);
//     })
//     .on("error", (error) => {
//       console.error("Помилка відстеження Chainlink:", error);
//     });
// };

// // Обслуговування статичних файлів
// app.use(express.static("public"));

// // Обробка підключень клієнтів через Socket.IO
// io.on("connection", (socket) => {
//   console.log("Новий клієнт підключився");

//   socket.on("disconnect", () => {
//     console.log("Клієнт відключився");
//   });
// });

// // Ініціалізація відстеження криптовалют
// const initTracking = () => {
//   trackEthereum();
//   trackBitcoin();
//   trackRipple();
//   //   trackStellar();
//   //   trackCardano();
//   trackPolkadot();
//   // trackDogecoin();
//   trackLitecoin();
//   trackBitcoinCash();
//   // trackChainlink(); // Розкоментуйте після налаштування ABI та адреси контракту
// };

// initTracking();

// // Запуск серверу
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Сервер запущено на порті ${PORT}`);
// });

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3001",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3001",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   socket.on("disconnect", (reason) => {
//     console.log(`Client disconnected: ${socket.id} - Reason: ${reason}`);
//   });
// });

// let lastBitcoinBlockHeight = 0;

// const trackBitcoin = () => {
//   const fetchLatestBlock = async () => {
//     try {
//       const response = await axios.get("https://blockchain.info/latestblock");
//       const latestBlock = response.data;

//       if (latestBlock.height !== lastBitcoinBlockHeight) {
//         lastBitcoinBlockHeight = latestBlock.height;
//         console.log(`New BTC block: ${latestBlock.height}`);
//         io.emit("newBlock", latestBlock);
//       }
//     } catch (error) {
//       console.error("Error fetching BTC block:", error.message);
//     }
//   };

//   fetchLatestBlock();
//   setInterval(fetchLatestBlock, 20000);
// };

// const fetchBitcoinPrice = async () => {
//   try {
//     const response = await axios.get(
//       "http://localhost:4000/v1/bpi/currentprice/BTC/1sec"
//     );
//     const price = response.data.bpi.USD.rate;
//     return price;
//   } catch (error) {
//     console.error("Error fetching Bitcoin price:", error);
//     throw error;
//   }
// };
// const trackBitcoinPrice = () => {
//   setInterval(async () => {
//     try {
//       const price = await fetchBitcoinPrice();
//       if (price) {
//         io.emit("priceUpdate", { price }); // Emit price only if fetched successfully
//       }
//     } catch (error) {
//       console.error("Error emitting price update:", error);
//     }
//   }, 100); // Changed to 10 seconds
// };

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   trackBitcoin();
//   trackBitcoinPrice();
// });
