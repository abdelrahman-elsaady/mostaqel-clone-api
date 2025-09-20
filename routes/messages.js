const express = require('express');
const Message = require('../models/messages');
const router = express.Router();
const Conversation = require('../models/conversation');
const messageController = require('../controllers/messages');
let {auth,restrictTo}=require('../middlewares/authorization')

router.post('/', auth, messageController.sendMessage);
router.get('/:conversationId', auth, messageController.getMessages);
router.post('/read/:messageId', auth, async (req, res) => {
    const {messageId} = req.params
    const {userId} = req.body
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
      );
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});
router.get('/recent/:userId', auth, async (req, res) => {
    try {
      const recentConversations = await Conversation.find({
        $or: [{ client: req.params.userId }, { freelancerId: req.params.userId }]
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('client', 'firstName lastName profilePicture')
        .populate('freelancerId', 'firstName lastName profilePicture')
        .populate('projectId', 'title')
        .populate('lastMessage');
      const formattedConversations = recentConversations.map(conv => {
        const otherUser = conv.client._id.toString() === req.params.userId ? conv.freelancerId : conv.client;
        return {
          conversationId: conv._id,
          projectTitle: conv.projectId.title,
          senderName: `${otherUser.firstName} ${otherUser.lastName}`,
          senderAvatar: otherUser.profilePicture,
          content: conv.lastMessage ? conv.lastMessage.content : '',
          time: conv.updatedAt.toLocaleString('ar-EG'),
          readBy: conv.lastMessage ? conv.lastMessage.readBy : []
        };
      });
      res.json(formattedConversations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
router.post('/upload', auth, messageController.uploadFile);

module.exports = router;
