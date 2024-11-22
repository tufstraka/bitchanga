import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    address: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    connectedAt: {
      type: Date,
      default: Date.now
    },
    lastUsed: {
      type: Date,
      default: Date.now
    }
  }, { timestamps: true });
  
  // Ensure unique wallet address per user
  walletSchema.index({ userId: 1, address: 1 }, { unique: true });
  
  module.exports = mongoose.model('Wallet', walletSchema);