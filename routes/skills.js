

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skills');
let {auth,restrictTo}=require('../middlewares/authorization')

router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);
router.post('/', auth, restrictTo('admin'), skillController.createSkill);
router.patch('/:id', auth, restrictTo('admin'), skillController.updateSkill);
router.delete('/:id', auth, restrictTo('admin'), skillController.deleteSkill);

module.exports = router;
