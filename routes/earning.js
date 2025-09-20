
const express = require('express');
const router = express.Router();
const { getEarnings } = require('../controllers/earning');
let {auth,restrictTo}=require('../middlewares/authorization')

router.get('/:userId', auth, getEarnings);

module.exports = router;
