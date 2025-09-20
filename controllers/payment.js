const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const Project = require('../models/project');
const User = require('../models/users');
const PlatformEarnings = require('../models/platformEarnings');

const PLATFORM_FEE_PERCENTAGE = 0.15; // 15%

class PaymentService {
  // ... existing methods ...

  static async recordPlatformEarnings(transaction, projectId) {
    try {
      await PlatformEarnings.create({
        amount: transaction.fee,
        type: 'PROJECT_FEE',
        project: projectId,
        transaction: transaction._id,
        percentage: PLATFORM_FEE_PERCENTAGE * 100 // Store as whole number (15)
      });
    } catch (error) {
      console.error('Error recording platform earnings:', error);
      // Don't throw - we don't want to break the payment flow
    }
  }

  static async handleSuccessfulPayment(paymentIntent) {
    const { projectId, clientId } = paymentIntent.metadata;
    const project = await Project.findById(projectId);
    const freelancer = await User.findById(project.freelancer);

    // Create transaction record
    const transaction = await Transaction.create({
      type: 'PAYMENT',
      amount: project.agreedAmount,
      fee: project.agreedAmount * PLATFORM_FEE_PERCENTAGE,
      status: 'COMPLETED',
      project: projectId,
      payer: clientId,
      payee: project.freelancer,
      paymentMethod: 'STRIPE',
      paymentDetails: {
        paymentIntentId: paymentIntent.id
      }
    });

    // Record platform earnings
    await this.recordPlatformEarnings(transaction, projectId);

    // Update project status
    project.paymentStatus = 'ESCROW';
    await project.save();

    // Update freelancer's pending balance
    freelancer.pendingBalance += project.agreedAmount * (1 - PLATFORM_FEE_PERCENTAGE);
    await freelancer.save();

    return transaction;
  }

  static async processWithdrawal(userId, amount, method) {
    const user = await User.findById(userId);
    
    if (user.availableBalance < amount) {
      throw new Error('Insufficient funds');
    }

    // Calculate withdrawal fee if applicable
    const withdrawalFee = method === 'BANK_TRANSFER' ? amount * 0.01 : 0; // Example: 1% fee for bank transfers

    const transaction = await Transaction.create({
      type: 'WITHDRAWAL',
      amount,
      fee: withdrawalFee,
      status: 'PENDING',
      payee: userId,
      paymentMethod: method
    });

    if (withdrawalFee > 0) {
      // Record withdrawal fee as platform earnings
      await PlatformEarnings.create({
        amount: withdrawalFee,
        type: 'WITHDRAWAL_FEE',
        transaction: transaction._id,
        percentage: 1 // 1% for bank transfers
      });
    }

    if (method === 'STRIPE') {
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        destination: user.stripeConnectedAccountId
      });
      
      transaction.paymentDetails.transferId = transfer.id;
      transaction.status = 'COMPLETED';
      await transaction.save();
    }

    user.availableBalance -= (amount + withdrawalFee);
    await user.save();

    return transaction;
  }
}

module.exports = PaymentService;