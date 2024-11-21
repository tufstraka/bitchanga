const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { verifyToken } = require('../utils/auth');

router.get('/total-funds', verifyToken, async (req, res) => {
  try {
    const totalFunds = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$raisedAmount' } } }
    ]);
    res.json({ totalFunds: totalFunds[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/project/:id/metrics', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const metrics = {
      raisedAmount: project.raisedAmount,
      targetAmount: project.targetAmount,
      percentageComplete: (project.raisedAmount / project.targetAmount) * 100,
      investorCount: project.investors.length
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;