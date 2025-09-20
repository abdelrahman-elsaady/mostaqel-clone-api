const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
}).single('file');

// Add new file upload endpoint
exports.uploadFile = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const { conversationId, senderId } = req.body;
      const fileUrl = `http://localhost:3344/uploads/${req.file.filename}`;
      
      const newMessage = {
        conversationId,
        senderId,
        content: `Shared file: ${req.file.originalname}`,
        fileUrl,
        fileSize: req.file.size
      };

      const savedMessage = await messageModel.create(newMessage);
      const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { lastMessage: savedMessage._id },
        { new: true }
      ).populate('projectId client freelancerId');

      // Publish to Ably channels (similar to sendMessage)
      const ably = req.app.get('ably');
      const conversationChannel = ably.channels.get(`conversation-${conversationId}`);
      await conversationChannel.publish('new-message', {
        _id: savedMessage._id,
        content: savedMessage.content,
        senderId: savedMessage.senderId,
        createdAt: savedMessage.createdAt,
        readBy: savedMessage.readBy,
        fileUrl: savedMessage.fileUrl,
        fileSize: savedMessage.fileSize
      });

      res.status(201).json(savedMessage);
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    const newMessage = { conversationId, senderId, content };

    const savedMessage = await messageModel.create(newMessage);

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: savedMessage._id },
      { new: true }
    ).populate('projectId client freelancerId');
    
    const ably = req.app.get('ably');
    
    // Publish to conversation channel with minimal data
    const conversationChannel = ably.channels.get(`conversation-${conversationId}`);
    await conversationChannel.publish('new-message', {
      _id: savedMessage._id,
      content: savedMessage.content,
      senderId: savedMessage.senderId,
      createdAt: savedMessage.createdAt,
      readBy: savedMessage.readBy
    });

    let recipientId = conversation.client._id.toString() === senderId 
      ? conversation.freelancerId._id.toString()  // if sender is client, send to freelancer
      : conversation.client._id.toString();       // if sender is freelancer, send to client

    const userChannel = ably.channels.get(`user-${recipientId}`);
    await userChannel.publish('message-notification', {
      _id: savedMessage._id,
      conversationId: conversation._id,
      projectTitle: conversation.projectId.title,
      senderName: conversation.client._id.toString() === senderId 
        ? conversation.client.firstName 
        : conversation.freelancerId.firstName,
      senderAvatar: conversation.client._id.toString() === senderId 
        ? conversation.client.profilePicture
        : conversation.freelancerId.profilePicture,
      content: savedMessage.content
    });

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};








exports.getMessages = async (req, res) => {
  try {
    console.log("getMessages");
    const { conversationId } = req.params;
    const messages = await messageModel.find({ conversationId: conversationId }).populate('senderId').sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};








