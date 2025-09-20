const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { addPlatformEarnings } = require('../controllers/platformEarnings');
let {auth,restrictTo}=require('../middlewares/authorization')

router.post('/transfer', auth, async (req, res) => {
  const { senderId, receiverId, amount, projectId } = req.body;
  const PLATFORM_FEE_PERCENTAGE = 0.15; // 15%
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (sender.totalBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    const platformFee = amount * PLATFORM_FEE_PERCENTAGE;
    const receiverAmount = amount - platformFee;
    sender.totalBalance -= amount;
    receiver.totalBalance += receiverAmount;
    await addPlatformEarnings(platformFee, projectId, senderId, receiverId);
    await sender.save();
    await receiver.save();
    const ably = req.app.get('ably');
    const userChannel = ably.channels.get(`user-${receiverId}`);
    await userChannel.publish('money-received', {
      senderId: sender._id,
      senderName: sender.firstName + ' ' + sender.lastName,
      senderAvatar: sender.profilePicture,
      amount: receiverAmount
    });
    res.status(200).json({ 
      message: 'Transfer successful',
      platformFee,
      receiverAmount,
      totalAmount: amount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing transfer', error: error.message });
  }
});

module.exports = router; 
