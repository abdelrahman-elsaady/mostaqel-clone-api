// models/Complaint.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['Open', 'In Progress', 'Resolved'],
      message: 'Status must be Open, In Progress, or Resolved'
    },
    default: 'Open'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  resolvedDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.createdDate;
      },
      message: 'Resolved date must be after created date'
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User ID is required']
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
