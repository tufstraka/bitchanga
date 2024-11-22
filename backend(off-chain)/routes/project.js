const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { verifyToken } = require('../utils/auth');

// Create project
router.post('/', verifyToken, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      builder: req.user.id
    });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('builder', 'username');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Invest in project
router.post('/:id/invest', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.investors.push({
      user: req.user.id,
      amount: req.body.amount
    });
    project.raisedAmount += req.body.amount;
    
    if (project.raisedAmount >= project.targetAmount) {
      project.status = 'funded';
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;