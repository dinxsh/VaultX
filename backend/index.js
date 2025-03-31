const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mock data for testing
const mockData = {
  tokens: [
    {
      token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      name: "Ethereum",
      symbol: "ETH",
      logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      balance: "0.01",
      decimals: "18",
      price_change_24h: -0.29,
      usd_price: 18.58
    },
    {
      token_address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      name: "Polygon",
      symbol: "MATIC",
      logo: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
      balance: "0.00",
      decimals: "18",
      price_change_24h: 0,
      usd_price: 0.00
    },
    {
      token_address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
      name: "Solana",
      symbol: "SOL",
      logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      balance: "0.00",
      decimals: "18",
      price_change_24h: 0,
      usd_price: 0.00
    }
  ],
  nfts: [
    {
      id: "1",
      name: "Bored Ape #7238",
      collection: "Bored Ape Yacht Club",
      image: "https://i.seadn.io/gcs/files/c49d2493f2ef4a40a5306dfa753a9b7c.png",
      floor_price: "18.5 ETH"
    },
    {
      id: "2",
      name: "Azuki #4623",
      collection: "Azuki",
      image: "https://i.seadn.io/gcs/files/c3bca0c70e12f4a7fad6b0a5ef104af9.png",
      floor_price: "12.2 ETH"
    },
    {
      id: "3",
      name: "Doodle #8748",
      collection: "Doodles",
      image: "https://i.seadn.io/gcs/files/f1273e4d0d141ed4f0c6242a32ad9a32.png",
      floor_price: "3.8 ETH"
    }
  ],
  balance: "2.5",
  tokenTransfers: [
    {
      token_symbol: "ETH",
      token_logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      from_address: "0x1234567890123456789012345678901234567890",
      to_address: "0x0987654321098765432109876543210987654321",
      value: "1200000000000000000",
      decimals: "18",
      block_timestamp: "2024-03-31T10:15:00Z",
      transaction_type: "Received",
      usd_value: "3,894.80"
    },
    {
      token_symbol: "WBTC",
      token_logo: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
      from_address: "0x0987654321098765432109876543210987654321",
      to_address: "0x1234567890123456789012345678901234567890",
      value: "2500000",
      decimals: "8",
      block_timestamp: "2024-03-31T09:30:00Z",
      transaction_type: "Sent",
      usd_value: "15,863.03"
    },
    {
      token_symbol: "LINK",
      token_logo: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
      from_address: "0x2468135790246813579024681357902468135790",
      to_address: "0x1234567890123456789012345678901234567890",
      value: "50000000000000000000",
      decimals: "18",
      block_timestamp: "2024-03-31T08:45:00Z",
      transaction_type: "Received",
      usd_value: "741.00"
    }
  ],
  nftTransfers: []
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Get wallet tokens, NFTs, and native balance
app.get("/getTokens", (req, res) => {
  console.log("Received request for /getTokens");
  console.log("Query parameters:", req.query);
  
  // Always return mock data
  res.status(200).json(mockData);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(mockData); // Return mock data even on error
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} with mock data`);
  console.log(`Access the mock data at http://localhost:${port}/getTokens`);
});
