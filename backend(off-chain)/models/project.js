const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  canisterId: { type: String, required: true},
  category: {
    type: String,
    enum: ['tech', 'sustainability', 'health', 'education', 'finance', 'gaming'], // Added 'gaming'
    required: true,
  },
  stage: { type: String, required: true},
  targetAmount: { type: Number, required: true },
  teamSize: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  builder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investors: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    timestamp: { type: Date, default: Date.now },
  }],
  backers: { type: Number, default: 0 }, 
  daysLeft: { type: Number, default: 0 }, 
  progress: { type: Number, default: 0 }, 
  timeline: { type: String, required: true },
  tags: [{ type: String }],
  status: { type: String, enum: ['active', 'funded', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);
