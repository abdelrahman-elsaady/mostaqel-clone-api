



const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['PAYMENT', 'WITHDRAWAL', 'PLATFORM_FEE', 'REFUND'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  paymentMethod: {
    type: String,
    enum: ['STRIPE', 'PAYPAL', 'BANK_TRANSFER'],
    required: true
  },
  paymentDetails: {
    paymentIntentId: String,
    transferId: String,
    payoutId: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);