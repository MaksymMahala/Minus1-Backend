const cryptocurrencies = [
  {
    symbol: "BTCUSDT",
    name: "Bitcoin",
    id: 1,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1.png",
  },
  {
    symbol: "ETHUSDT",
    name: "Ethereum",
    id: 1027,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png",
  },
  {
    symbol: "BNBUSDT",
    name: "Binance Coin",
    id: 1839,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1839.png",
  },
  {
    symbol: "XRPUSDT",
    name: "XRP",
    id: 52,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/52.png",
  },
  {
    symbol: "LTCUSDT",
    name: "Litecoin",
    id: 2,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/2.png",
  },
  {
    symbol: "ADAUSDT",
    name: "Cardano",
    id: 2010,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/2010.png",
  },
  {
    symbol: "SOLUSDT",
    name: "Solana",
    id: 5426,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/5426.png",
  },
  {
    symbol: "DOTUSDT",
    name: "Polkadot",
    id: 6636,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/6636.png",
  },
  {
    symbol: "DOGEUSDT",
    name: "Dogecoin",
    id: 74,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/74.png",
  },
  {
    symbol: "MATICUSDT",
    name: "Polygon",
    id: 3890,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/3890.png",
  },
  {
    symbol: "TRXUSDT",
    name: "TRON",
    id: 1958,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1958.png",
  },
  {
    symbol: "SHIBUSDT",
    name: "Shiba Inu",
    id: 5994,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/5994.png",
  },
  {
    symbol: "AVAXUSDT",
    name: "Avalanche",
    id: 5805,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/5805.png",
  },
  {
    symbol: "LINKUSDT",
    name: "Chainlink",
    id: 1975,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1975.png",
  },
  {
    symbol: "XLMUSDT",
    name: "Stellar",
    id: 512,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/512.png",
  },
  {
    symbol: "FILUSDT",
    name: "Filecoin",
    id: 2280,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/2280.png",
  },
  {
    symbol: "LUNAUSDT",
    name: "Terra",
    id: 4172,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/4172.png",
  },
  {
    symbol: "ICPUSDT",
    name: "Internet Computer",
    id: 8916,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/8916.png",
  },
  {
    symbol: "NEARUSDT",
    name: "NEAR Protocol",
    id: 6535,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/6535.png",
  },
  {
    symbol: "VETUSDT",
    name: "VeChain",
    id: 3077,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/3077.png",
  },
  {
    symbol: "THETAUSDT",
    name: "Theta Network",
    id: 2416,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/2416.png",
  },
  {
    symbol: "EOSUSDT",
    name: "EOS",
    id: 1765,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1765.png",
  },
  {
    symbol: "AAVEUSDT",
    name: "Aave",
    id: 7278,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/7278.png",
  },
  {
    symbol: "SANDUSDT",
    name: "The Sandbox",
    id: 6210,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/6210.png",
  },
  {
    symbol: "MANAUSDT",
    name: "Decentraland",
    id: 1966,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1966.png",
  },
  {
    symbol: "ZILUSDT",
    name: "Zilliqa",
    id: 2469,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/2469.png",
  },
  {
    symbol: "QTUMUSDT",
    name: "Qtum",
    id: 1684,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1684.png",
  },
  {
    symbol: "BATUSDT",
    name: "Basic Attention Token",
    id: 1697,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1697.png",
  },
  {
    symbol: "ENJUSDT",
    name: "Enjin Coin",
    id: 2130,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/2130.png",
  },
  {
    symbol: "CHZUSDT",
    name: "Chiliz",
    id: 4066,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/4066.png",
  },
  {
    symbol: "DGBUSDT",
    name: "DigiByte",
    id: 109,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/109.png",
  },
  {
    symbol: "DASHUSDT",
    name: "Dash",
    id: 131,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/131.png",
  },
  {
    symbol: "NANOUSDT",
    name: "Nano",
    id: 1567,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1567.png",
  },
  {
    symbol: "ZRXUSDT",
    name: "0x",
    id: 1896,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1896.png",
  },
  {
    symbol: "WAVESUSDT",
    name: "Waves",
    id: 1274,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/1274.png",
  },
  {
    symbol: "KSMUSDT",
    name: "Kusama",
    id: 5034,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/5034.png",
  },
  {
    symbol: "BTTUSDT",
    name: "BitTorrent",
    id: 3718,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/3718.png",
  },
  {
    symbol: "YFIUSDT",
    name: "yearn.finance",
    id: 5864,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/5864.png",
  },
  {
    symbol: "GRTUSDT",
    name: "The Graph",
    id: 6292,
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/6292.png",
  },
];

module.exports = { cryptocurrencies };
