
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
let charge = async (req, res) => {


    console.log("Received charge request:", req.body);



    
    try {
        const { id, amount } = req.body;



        console.log("Creating payment intent for amount:", amount);
if (!stripe) {
      throw new Error('Stripe is not initialized. Check your STRIPE_SECRET_KEY.');
    }
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'USD',
            description: 'Deposit to account',
            payment_method: id,
            confirm: true,
            return_url: `https://mostaqel-clone.vercel.app/freelancers`, 
        });

        console.log("Payment intent created:", paymentIntent.id);

        res.json({
            message: 'Payment successful',
            success: true,
            paymentIntent: paymentIntent.id
        });
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({
            message: 'Payment failed',
            success: false,
            error: error.message
        });
    }
}




module.exports = {charge};
