const express = require('express');
const router = express.Router();
const {createProject , getProjects  , updateProject , deleteProject , getProjectById, saveProposal, getProjectsByClient, acceptProposal} = require('../controllers/project');
let {auth,restrictTo}=require('../middlewares/authorization')

router.post('/', auth, createProject);
router.get('/', getProjects);
router.post('/accept-proposal', auth, acceptProposal);
router.get('/client/:id', auth, getProjectsByClient);
router.post('/proposals/:id', auth, saveProposal);
router.patch('/:id', auth, updateProject);
router.get('/:id', getProjectById);
router.delete('/:id', auth, deleteProject);

module.exports = router;
