import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['active', 'funded', 'completed', 'cancelled'],
    default: 'active'
  },
  walletAddress: { type: String, required: true },
  deadline: { type: Date, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model('Project', projectSchema);