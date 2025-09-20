const express = require('express');

const { auth, restrictTo } = require('../middlewares/authorization');

const {
  saveUser, 
  showUsers, 
  getUserByID, 
  deleteUser, 
  updateUser, 
  Login, 
  updatePassword, 
  getUserByEmail, 
  getUsersByRole, 
  getFreelancers, 
  getClients
} = require('../controllers/users');

let router = express.Router();

router.get('/freelancers', getFreelancers);
router.get('/clients', getClients);
router.get('/role', getUsersByRole);
router.get('/email', getUserByEmail);

router.post('/', saveUser);

router.post('/login', Login);

router.get('/', getFreelancers);
router.get('/:id', getUserByID);
router.delete('/:id', auth, deleteUser);
router.patch('/:id', auth, updateUser);
router.patch('/updatePassword', auth, updatePassword);

module.exports=router
