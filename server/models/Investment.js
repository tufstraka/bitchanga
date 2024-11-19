import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  transactionHash: { type: String, required: true },
  walletType: { type: String, enum: ['plug', 'icp'], required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export const Investment = mongoose.model('Investment', investmentSchema);