import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['builder', 'investor'], required: true },
  walletAddress: { type: String },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model('User', userSchema);