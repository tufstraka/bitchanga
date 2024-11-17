// routes/user.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { connectPlugWallet } = require('../utils/plugWallet');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!['Builder', 'Investor'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Choose either "Builder" or "Investor".' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const walletId = await connectPlugWallet(username);

  const newUser = new User({ username, password: hashedPassword, walletId, role });
  await newUser.save();

  const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

module.exports = router;
