const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const { verifyToken } = require('../utils/auth');
const icpIdentity = require('../utils/icpIdentity');
const plugWallet = require('../utils/plugWallet');

// Connect ICP wallet
router.post('/connect/ckbtc', verifyToken, async (req, res) => {
  try {
    await icpIdentity.initialize();
    const success = await icpIdentity.login();
    
    if (success) {
      const identity = icpIdentity.getIdentity();
      const wallet = new Wallet({
        userId: req.user.id,
        type: 'ckBTC',
        address: identity.getPrincipal().toString()
      });
      await wallet.save();
      res.json({ message: 'ICP wallet connected successfully', wallet });
    } else {
      res.status(400).json({ message: 'Failed to connect ICP wallet' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect Plug wallet
router.post('/connect/plug', verifyToken, async (req, res) => {
  try {
    const connected = await plugWallet.connect();
    
    if (connected) {
      const wallet = new Wallet({
        userId: req.user.id,
        type: 'plugWallet',
        address: plugWallet.getAddress()
      });
      await wallet.save();
      res.json({ message: 'Plug wallet connected successfully', wallet });
    } else {
      res.status(400).json({ message: 'Failed to connect Plug wallet' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user wallets
router.get('/', verifyToken, async (req, res) => {
  try {
    const wallets = await Wallet.find({ userId: req.user.id });
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;