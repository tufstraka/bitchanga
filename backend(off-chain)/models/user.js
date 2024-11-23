const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  linkedinUrl: { type: String, required: true },
  experience: { type: String, required: true },
  userType: { type: String, enum: ['builder', 'investor'], required: true },
  walletAddress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);