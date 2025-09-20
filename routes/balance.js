


const express = require("express");
let router = express.Router();
const User = require('../models/users');
const {charge} = require('../controllers/balance')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
let {auth,restrictTo}=require('../middlewares/authorization')

router.post('/charge', auth, charge);
router.post('/withdraw', auth, async (req, res) => {
    try {
      const { amount, method, userid } = req.body;
      const user = await User.findById(userid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.totalBalance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      user.totalBalance -= amount;
      await user.save();
      res.json({ message: 'Withdrawal processed successfully', newBalance: user.totalBalance });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});
router.post('/create-connect-account', auth, async (req, res) => {
    try {
      const body = req.body
      const user = await User.findById(body.userid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.stripeConnectedAccountId) {
        return res.status(400).json({ message: 'Stripe account already exists' });
      }
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
        capabilities: {
          transfers: {requested: true},
        },
      });
      user.stripeConnectedAccountId = account.id;
      await user.save();
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.FRONTEND_URL}/stripe-connect-refresh`,
        return_url: `${process.env.FRONTEND_URL}/stripe-connect-return`,
        type: 'account_onboarding',
      });
      res.json({ url: accountLink.url });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
