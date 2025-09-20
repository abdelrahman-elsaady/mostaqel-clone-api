const PlatformEarnings = require('../models/platformEarnings');
const User = require('../models/users');
const Project = require('../models/project');
const paypal = require('@paypal/checkout-server-sdk');
const paypalClient = require('../routes/earningTransfeer');

exports.getPlatformEarnings = async (req, res) => {
  try {
    console.log("getPlatformEarnings");

        let earnings = await PlatformEarnings.findOne()
      .populate({
        path: 'transactions.projectId',
        model: 'Project',
        select: 'title'
      })
      .populate({
        path: 'transactions.senderId',
        model: 'user',
        select: 'firstName lastName email profilePicture'
      })
      .populate({
        path: 'transactions.receiverId',
        model: 'user',
        select: 'firstName lastName email profilePicture'
      });
   
    console.log("earnings", earnings);

    res.status(200).json(earnings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Error fetching platform earnings', error: error.message });
  }
};

exports.addPlatformEarnings = async (amount, projectId, senderId, receiverId) => {
  try {
    let platformEarnings = await PlatformEarnings.findOne();
    
    if (!platformEarnings) {
      platformEarnings = new PlatformEarnings({ totalEarnings: 0 });
    }

    platformEarnings.totalEarnings += amount;
    platformEarnings.transactions.push({
      amount,
      projectId,
      senderId,
      receiverId
    });

    await platformEarnings.save();
    return platformEarnings;
  } catch (error) {
    throw new Error('Error adding platform earnings: ' + error.message);
  }
}; 

// const PlatformEarnings = require('../models/platformEarnings');


// ... existing getPlatformEarnings and addPlatformEarnings methods ...

exports.initiatePaypalTransfer = async (req, res) => {
  try {
    const { amount } = req.body;

    // Create PayPal Order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        }
      }]
    });

    // Call PayPal to create the order
    const order = await paypalClient.execute(request);
    
    res.json({
      orderID: order.result.id
    });

  } catch (error) {
    console.error('PayPal transfer error:', error);
    res.status(500).json({
      error: 'Failed to create PayPal transfer',
      details: error.message
    });
  }
};

exports.completePaypalTransfer = async (req, res) => {
  try {
    const { orderId } = req.params;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await paypalClient.execute(request);

    // Update your database
    const platformEarnings = await PlatformEarnings.findOne();
    if (capture.result.status === 'COMPLETED') {
      platformEarnings.totalEarnings -= platformEarnings.pendingTransfer.amount;
      platformEarnings.pendingTransfer.status = 'COMPLETED';
      await platformEarnings.save();
    }

    res.json({ status: 'success' });

  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ 
      message: 'Error completing PayPal transfer', 
      error: error.message 
    });
  }
};