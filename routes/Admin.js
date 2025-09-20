const express = require('express');
const router = express.Router();
let {auth,restrictTo}=require('../middlewares/authorization')
const { getAdmins, getAdminById, updateAdmin, deleteAdmin, addAdmin, loginAdmin } = require('../controllers/Admin');

router.post('/register', addAdmin);
router.post('/login', loginAdmin);
router.get('/', getAdmins);
router.get('/:id', getAdminById);
router.put('/:id', auth, restrictTo('admin'), updateAdmin);
router.delete('/:id', auth, restrictTo('admin'), deleteAdmin);

module.exports = router;
