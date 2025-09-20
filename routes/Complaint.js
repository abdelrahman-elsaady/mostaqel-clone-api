const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaint, deleteComplaint } = require('../controllers/Complaint');
let {auth,restrictTo}=require('../middlewares/authorization')

router.post('/', auth, createComplaint);
router.get('/', getComplaints);
router.put('/:id', auth, updateComplaint);
router.delete('/:id', auth, deleteComplaint);

module.exports = router;
