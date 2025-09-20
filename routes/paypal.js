

const express = require('express');
const paypal = require('@paypal/payouts-sdk');
const router = express.Router();


let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

router.post('/paypal-withdrawal', async (req, res) => {
  try {
    const { userId, amount, email } = req.body;
    console.log(userId, amount, email);


    let request = new paypal.payouts.PayoutsPostRequest();
    request.requestBody({
      sender_batch_header: {
        sender_batch_id: `Payout_${Date.now()}`,
        email_subject: "You have a payout!",
        email_message: "You have received a payout! Thanks for using our service!"
      },
      items: [{
        recipient_type: "EMAIL",
        amount: {
          value: amount,
          currency: "USD"
        },
        sender_item_id: `${userId}_${Date.now()}`,
        receiver: email,
        note: "Thanks for your patronage!"
      }]
    });

    let response = await client.execute(request);
    console.log(`Payout created successfully`);

    
    
    res.json({ success: true, payoutId: response.result.batch_header.payout_batch_id });
  } catch (error) {
    console.error('Error processing PayPal payout:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
