const express = require('express');
const { Alchemy, Network } = require('alchemy-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Alchemy configuration
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET // Change the network if needed
};
const alchemy = new Alchemy(settings);

// Custom address validation function
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Convert hex balance to decimal string
function convertHexToDecimal(hexValue, decimals = 18) {
  const balance = BigInt(hexValue);
  const divisor = BigInt(10 ** decimals);
  return (balance / divisor).toString(); // Divide the balance by the token's decimals
}

// Endpoint to get token balance using Alchemy SDK
app.get('/token-balance', async (req, res) => {
  let { walletAddress, tokenAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  walletAddress = walletAddress.trim();

  if (!isValidAddress(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    // Fetch the token balance using Alchemy SDK
    const balanceData = await alchemy.core.getTokenBalances(walletAddress, [tokenAddress]);

    if (balanceData.tokenBalances.length > 0) {
      const tokenBalance = balanceData.tokenBalances[0];

      // Convert the balance from hexadecimal to a decimal string
      const decimalBalance = convertHexToDecimal(tokenBalance.tokenBalance);

      res.json({ tokenAddress: tokenBalance.contractAddress, balance: decimalBalance });
    } else {
      res.json({ tokenAddress: tokenAddress, balance: '0' });
    }
  } catch (error) {
    console.error('Error fetching token balance from Alchemy:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving the balance', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
