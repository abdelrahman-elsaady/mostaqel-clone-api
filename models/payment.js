const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    amount: { 
        type: Number, 
        required: true 
    },
    datePaid: { 
        type: Date, 
        default: Date.now 
    },
    method: { 
        type: String, 
        enum: ['credit card', 'paypal', 'bank transfer'], 
        required: true },
    status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'pending' 
    },
    jobID: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'job', 
        required: true 
    },
    freelancerID: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user', 
        required: true 
    },
    clientID: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user', 
        required: true 
    }
});

const paymentModel= mongoose.model('Payment', paymentSchema);
module.exports = paymentModel