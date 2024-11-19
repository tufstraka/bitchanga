import { Investment } from '../models/Investment.js';
import { Project } from '../models/Project.js';
import { WalletService } from './walletService.js';
import mongoose from 'mongoose';

export class InvestmentService {
  static async createInvestment(investmentData, investorId, investorPrincipal) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { projectId, amount, walletType } = investmentData;

      const project = await Project.findById(projectId)
        .populate('creator')
        .session(session);
        
      if (!project) {
        throw new Error('Project not found');
      }

      // Verify investor has sufficient balance
      const balance = await WalletService.getBalance(investorPrincipal);
      if (balance < amount) {
        throw new Error('Insufficient ckBTC balance');
      }

      // Transfer ckBTC to project creator's wallet
      const txHash = await WalletService.transferCkBTC(
        investorPrincipal,
        project.creator.walletAddress,
        amount
      );

      const investment = new Investment({
        project: projectId,
        investor: investorId,
        amount,
        transactionHash: txHash,
        walletType,
        status: 'completed'
      });

      await investment.save({ session });

      project.currentAmount += amount;
      if (project.currentAmount >= project.targetAmount) {
        project.status = 'funded';
      }
      await project.save({ session });

      await session.commitTransaction();
      return investment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getUserInvestments(userId) {
    return Investment.find({ investor: userId })
      .populate('project')
      .sort({ createdAt: -1 });
  }
}