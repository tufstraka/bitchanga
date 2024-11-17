// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  amountRequested: { type: Number, required: true },
  investedAmount: { type: Number, default: 0 },
  walletId: String,
  investors: [{ userId: String, amount: Number }],
});

module.exports = mongoose.model('Project', ProjectSchema);
