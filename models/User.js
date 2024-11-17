// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletId: String,
  role: { type: String, enum: ['Builder', 'Investor'], required: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
});

module.exports = mongoose.model('User', UserSchema);
