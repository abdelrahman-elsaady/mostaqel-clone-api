const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  
  content: {
    type: String,
    required: true
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  fileUrl: {
    type: String
  },
  fileSize: {
    type: Number
  }
});

module.exports = mongoose.model('Message', MessageSchema);