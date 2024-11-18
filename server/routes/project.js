// routes/project.js
const express = require('express');
const Project = require('../models/Project');
const { authenticateToken, requireRole } = require('../utils/auth');
const { transferPlugFunds } = require('../utils/plugWallet');

const router = express.Router();

router.post('/create', authenticateToken, requireRole('Builder'), async (req, res) => {
  const { name, description, amountRequested } = req.body;
  const project = new Project({
    name,
    description,
    amountRequested,
    walletId: req.user.walletId,
  });

  await project.save();
  res.status(201).json({ project });
});

router.post('/invest', authenticateToken, requireRole('Investor'), async (req, res) => {
  const { projectId, amount } = req.body;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  await transferPlugFunds(project.walletId, amount);  // Process the payment
  project.investedAmount += amount;
  project.investors.push({ userId: req.user.userId, amount });
  await project.save();

  res.status(200).json({ success: true, investedAmount: project.investedAmount });
});

module.exports = router;