import express from 'express';
import { InvestmentService } from '../services/investmentService.js';
import { WalletService } from '../services/walletService.js';
import { auth } from '../middleware/auth.js';
import { investmentValidationRules, validate } from '../middleware/validators.js';

const router = express.Router();

// Connect wallet
router.post('/connect-wallet', auth, async (req, res) => {
  try {
    const { walletType } = req.body;
    let principal;

    if (walletType === 'plug') {
      principal = await WalletService.connectPlugWallet();
    } else if (walletType === 'icp') {
      principal = await WalletService.connectICPWallet();
    } else {
      return res.status(400).json({ message: 'Invalid wallet type' });
    }

    // Update user's wallet address
    req.user.walletAddress = principal;
    await req.user.save();

    res.json({ principal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    if (!req.user.walletAddress) {
      return res.status(400).json({ message: 'No wallet connected' });
    }

    const balance = await WalletService.getBalance(req.user.walletAddress);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new investment
router.post('/', [auth, ...investmentValidationRules, validate], async (req, res) => {
  try {
    if (!req.user.walletAddress) {
      return res.status(400).json({ message: 'Please connect a wallet first' });
    }

    const investment = await InvestmentService.createInvestment(
      req.body,
      req.user._id,
      req.user.walletAddress
    );
    
    res.status(201).json(investment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user investments
router.get('/user', auth, async (req, res) => {
  try {
    const investments = await InvestmentService.getUserInvestments(req.user._id);
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as investmentRoutes };