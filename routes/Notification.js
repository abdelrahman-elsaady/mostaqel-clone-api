const express = require('express');
const router = express.Router();
const { createNotification, getNotificationsByUser, updateNotification, deleteNotification } = require('../controllers/Notification');
let {auth,restrictTo}=require('../middlewares/authorization')

router.post('/', auth, createNotification);
router.get('/', getNotificationsByUser);
router.put('/:id', auth, updateNotification);
router.delete('/:id', auth, deleteNotification);

module.exports = router;
