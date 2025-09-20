// const mongoose = require('mongoose')
// let ProjectSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     // required: true
//   },
//   status: {
//     type: String,
//     enum: ['Not Started', 'In Progress', 'Completed'],
//     default: 'Not Started'
//   },
//   startDate: {
//     type: Date,
//     default: Date.now
//   },
//   endDate: {
//     type: Date
//   },
//   userId: {
//     type: String,
//     ref: 'User',
//     // required: true
//   }
// });

// let projectModel =  mongoose.model('Project', ProjectSchema);
// module.exports = projectModel

const mongoose = require('mongoose');

// const bidSchema = new mongoose.Schema({
//   // ... (keep the bid schema as it was)
// });

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Client is required']
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'proposals'
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: [true, 'Category is required']
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  budget: {
    min: {
      type: Number,
      required: [true, 'Minimum budget is required'],
      min: [1, 'Minimum budget must be at least $1']
    },
    max: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      min: [1, 'Maximum budget must be at least $1'],
      validate: {
        validator: function(v) {
          return v >= this.budget.min;
        },
        message: 'Maximum budget must be greater than or equal to minimum budget'
      }
    }
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
    enum: {
      values: ['1 day', '3 days', '1 week', '2 weeks', '1 month', '2 months', '3 months', '6 months'],
      message: 'Invalid delivery time option'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'pending_payment', 'in_progress', 'completed', 'cancelled'],
      message: 'Invalid project status'
    },
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['UNPAID', 'ESCROW', 'RELEASED', 'REFUNDED'],
      message: 'Invalid payment status'
    },
    default: 'UNPAID'
  },
  agreedAmount: {
    type: Number,
    min: [0, 'Agreed amount cannot be negative']
  },
  acceptedProposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'proposals'
  },
  platformFee: {
    type: Number,
    min: [0, 'Platform fee cannot be negative']
  },
  escrowId: {
    type: String,
    trim: true
  }
});

// Virtual for bid count
ProjectSchema.virtual('proposalsCount', {
  ref: 'proposals',
  localField: '_id',
  foreignField: 'project',
  count: true
});

// Ensure virtuals are included when converting document to JSON
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });
// ... (keep the virtual fields and other settings as they were)

let projectModel =  mongoose.model('Project', ProjectSchema);

module.exports = projectModel

// const Project = mongoose.model('Project', projectSchema);

// module.exports = Project;
// status: {
//   type: String,
//   enum: ['open', 'pending_payment', 'in_progress', 'completed', 'cancelled'],
//   default: 'open'
// },
// acceptedProposal: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'proposals'
// },
// paymentStatus: {
//   type: String,
//   enum: ['unpaid', 'pending', 'paid', 'refunded'],
//   default: 'unpaid'
// }