const express = require('express');
const router = express.Router();
const { 
  getPlatformEarnings, 
  initiatePaypalTransfer,
  completePaypalTransfer
} = require('../controllers/platformEarnings');
let {auth,restrictTo}=require('../middlewares/authorization')

router.get('/', auth, getPlatformEarnings);
router.post('/transfer', auth, initiatePaypalTransfer);
router.get('/transfer/complete/:orderId', auth, completePaypalTransfer);

module.exports = router;


