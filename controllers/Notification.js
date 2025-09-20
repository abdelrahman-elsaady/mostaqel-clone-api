const Notification = require('../models/Notification');

// Create a new notification
let createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notifications for a user
let getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


let updateNotification=async(req,res)=>{
  
  try {
  await Notification.findByIdAndUpdate(req.params.id, req.body);
    res.json({message:"Notification updated successfully"} )
  }
    catch (error) {
    res.json({message:error.message})
}
}


// // Mark notification as read
// let markAsRead = async (req, res) => {
//   try {
//     const notification = await Notification.findById(req.params.id);
//     if (!notification) {
//       return res.status(404).json({ error: 'Notification not found' });
//     }
//     notification.read = true;
//     await notification.save();
//     res.status(200).json(notification);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// Delete a notification
let deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports={ createNotification ,updateNotification , getNotificationsByUser  , deleteNotification }