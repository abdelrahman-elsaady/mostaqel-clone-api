

const mongoose = require('mongoose')
 
const Schema = mongoose.Schema;

const proposalSchema = new Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required']
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Freelancer is required']
  },
  amount: {
    type: Number,
    required: [true, 'Proposal amount is required'],
    min: [1, 'Amount must be at least $1'],
    max: [100000, 'Amount cannot exceed $100,000']
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Delivery time is required'],
    min: [1, 'Delivery time must be at least 1 day'],
    max: [365, 'Delivery time cannot exceed 365 days']
  },
  receivables: {
    type: Number,
    required: [true, 'Receivables amount is required'],
    min: [0, 'Receivables cannot be negative'],
    validate: {
      validator: function(v) {
        return v <= this.amount;
      },
      message: 'Receivables cannot exceed proposal amount'
    }
  },
  proposal: {
    type: String,
    required: [true, 'Proposal description is required'],
    trim: true,
    minlength: [20, 'Proposal must be at least 20 characters'],
    maxlength: [2000, 'Proposal cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'rejected'],
      message: 'Status must be pending, accepted, or rejected'
    },
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

    // proposalSchema.statics.findByProject = function(projectId) {
    //   return this.find({ project: projectId }).exec();
    // };

  let proposalModel = mongoose.model('proposals', proposalSchema);

  module.exports = proposalModel
