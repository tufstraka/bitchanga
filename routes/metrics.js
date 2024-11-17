// routes/metrics.js
const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

router.get('/metrics', async (req, res) => {
  const totalProjects = await Project.countDocuments();
  const totalInvested = await Project.aggregate([{ $group: { _id: null, total: { $sum: "$investedAmount" } } }]);
  res.json({
    totalValueLocked: totalInvested[0].total,
    successRate: (totalProjects ? totalProjects / totalProjects : 0) * 100,
  });
});

module.exports = router;
