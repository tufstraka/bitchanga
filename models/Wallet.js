// models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  walletAddress: { type: String, required: true },
  balance: { type: Number, default: 0 },  // Balance in ckBTC
  cbtkWalletAddress: { type: String, required: true }, // Matoka wallet address
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
