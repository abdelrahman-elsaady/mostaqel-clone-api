

const Transaction = require('../models/Transaction');
const User = require('../models/users');

const getEarnings = async (req, res) => {
  try {
    console.log(req.params)
    const userId = req.params.userId
    // const userId = req.user._id

    // Get all transactions for this user
    const transactions = await Transaction.find({
      $or: [
        { payee: userId },
        { payer: userId }
      ]
    }).sort({ createdAt: -1 });

    // Calculate balances
    let totalBalance = 0;
    let pendingBalance = 0;
    let availableBalance = 0;

    transactions.forEach(transaction => {
      const isReceiver = transaction.payee.toString() === userId.toString();
      const amount = transaction.amount - (isReceiver ? transaction.fee : 0);

      if (isReceiver) {
        if (transaction.status === 'COMPLETED') {
          totalBalance += amount;
          availableBalance += amount;
        } else if (transaction.status === 'PENDING') {
          totalBalance += amount;
          pendingBalance += amount;
        }
      } else {
        if (transaction.status === 'COMPLETED') {
          totalBalance -= amount;
        }
      }
    });

    // Get user's current balance from DB
    const user = await User.findById(userId);
    
    // Format transactions for frontend
    const formattedTransactions = transactions.map(t => ({
      _id: t._id,
      type: t.type,
      amount: t.amount,
      fee: t.fee,
      status: t.status,
      createdAt: t.createdAt,
      paymentMethod: t.paymentMethod,
      isIncoming: t.payee.toString() === userId.toString()
    }));

    res.json({
      totalBalance: user.totalBalance,
      pendingBalance: user.pendingBalance,
      availableBalance: user.availableBalance,
      transactions: formattedTransactions
    });

  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ 
      message: 'Error fetching earnings', 
      error: error.message 
    });
  }
};

module.exports = {
  getEarnings
};