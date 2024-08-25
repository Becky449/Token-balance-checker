const { Alchemy, Network } = require('alchemy-sdk');

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

exports.getTokenBalanceController = async (req, res) => {
  let { walletAddress, tokenAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  walletAddress = walletAddress.trim();

  if (!isValidAddress(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    // Fetch token balances using Alchemy SDK
    const balanceData = await alchemy.core.getTokenBalances(walletAddress, [tokenAddress]);

    if (balanceData.tokenBalances.length > 0) {
      const tokenBalance = balanceData.tokenBalances[0];
      res.json({ tokenAddress: tokenBalance.contractAddress, balance: tokenBalance.tokenBalance });
    } else {
      res.json({ tokenAddress: tokenAddress, balance: '0' });
    }
  } catch (error) {
    console.error('Error fetching token balance:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving the balance', details: error.message });
  }
};
