

const Conversation = require('../models/conversation');

exports.createConversation = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.user);

    const { projectId, freelancerId, clientId, proposalId } = req.body;
    // const clientId = req.user.id;

    let isConversation = await Conversation.findOne({ proposalId: proposalId , freelancerId: freelancerId, client: clientId });

    if(isConversation){
      return res.status(200).json({ message: 'Conversation already exists', conversation: isConversation });
    }

    const conversation = new Conversation({
        projectId: projectId,
      client: clientId,
      freelancerId: freelancerId,
      proposalId: proposalId,
    });

    await conversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating conversation' });
  }
};

exports.getConversationsbyid = async (req, res) => {
    console.log(req.user);
    console.log('aboda');
  try {
 
    // const userId = req.user.id;
    const conversations = await Conversation.findById(req.params.id).populate('projectId').populate('client').populate('freelancerId').populate('proposalId');
    
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

exports.updateConversationStatus = async (req, res) => {
  try {
    const { status } = req.body;  
    const conversation = await Conversation.findByIdAndUpdate(req.params.id, { status: status }, { new: true });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating conversation status' });
  }
};


exports.getConversations = async (req, res) => {
    try {
      const conversations = await Conversation.find().populate('projectId').populate('client').populate('freelancerId');
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching conversations' });
    }
  };