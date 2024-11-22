const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const { verifyToken } = require('../middleware/auth');

/**
 * @route   POST /api/wallet/connect
 * @desc    Connect Internet Identity wallet
 * @access  Private
 */
router.post('/connect', verifyToken, async (req, res) => {
  try {
    const { principal } = req.body;
    
    if (!principal) {
      return res.status(400).json({
        success: false,
        message: 'Principal ID is required'
      });
    }

    // Check if wallet already exists for this user
    const existingWallet = await Wallet.findOne({
      userId: req.user.id,
      type: 'internetIdentity'
    });

    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: 'Internet Identity wallet already connected'
      });
    }

    // Create new wallet
    const wallet = new Wallet({
      userId: req.user.id,
      address: principal
    });

    await wallet.save();

    res.json({
      success: true,
      message: 'Wallet connected successfully',
      data: { wallet }
    });

  } catch (error) {
    console.error('Error connecting to the endpoint for saving wallet details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to the endpoint for saving wallet details'
    });
  }
});
