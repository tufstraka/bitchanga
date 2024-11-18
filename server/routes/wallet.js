// routes/wallet.js
const express = require('express');
const Wallet = require('../models/Wallet');
const router = express.Router();

// Link Wallet to User
router.post('/link-wallet', async (req, res) => {
  const { userId, walletAddress, cbtkWalletAddress } = req.body;

  try {
    const existingWallet = await Wallet.findOne({ userId });
    if (existingWallet) {
      return res.status(400).json({ message: 'Wallet already linked.' });
    }

    const newWallet = new Wallet({
      userId,
      walletAddress,
      cbtkWalletAddress,
    });

    await newWallet.save();
    res.status(201).json({ message: 'Wallet linked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check Wallet Balance
router.get('/balance/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }

    res.json({ balance: wallet.balance, cbtkWalletAddress: wallet.cbtkWalletAddress });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Investment in Project
router.post('/invest', async (req, res) => {
  const { userId, projectId, amount, walletAddress } = req.body;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found.' });
    }

    // Simulate the investment process (interaction with blockchain can be added here)
    const success = await investInProject(wallet.cbtkWalletAddress, amount);

    if (success) {
      wallet.balance -= amount;
      await wallet.save();
      res.status(200).json({ message: 'Investment successful' });
    } else {
      res.status(500).json({ message: 'Investment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Simulate blockchain smart contract interaction for investment
async function investInProject(cbtkWalletAddress, amount) {
  // Simulate interaction with the blockchain
  console.log(`Investing ${amount} in project through wallet: ${cbtkWalletAddress}`);
  return true; // Simulate success
}

module.exports = router;