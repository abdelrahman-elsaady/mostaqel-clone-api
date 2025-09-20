const express = require('express');
const router = express.Router();
const PaymentService = require('../controllers/payment');
let {auth,restrictTo}=require('../middlewares/authorization')

router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { projectId ,userId} = req.body;
    const paymentIntent = await PaymentService.createPaymentIntent(
      projectId,
      userId
    );
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') {
    await PaymentService.handleSuccessfulPayment(event.data.object);
  }
  res.json({ received: true });
});
router.post('/release-payment', auth, async (req, res) => {
  try {
    const { projectId } = req.body;
    const result = await PaymentService.releasePayment(projectId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, method } = req.body;
    const transaction = await PaymentService.processWithdrawal(
      req.user.id,
      amount,
      method
    );
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
