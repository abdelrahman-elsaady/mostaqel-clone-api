const express = require("express");
let router = express.Router();
let {auth,restrictTo}=require('../middlewares/authorization')
let {
  showProposals,
  saveProposal,
  updateProposalById,
  deleteProposal,
  getProposalsByProjectId,
} = require("../controllers/proposals");

router.get("/", showProposals);
router.get("/project/:id", getProposalsByProjectId);
router.post('/', auth, saveProposal);
router.delete('/:id', auth, deleteProposal);
router.patch('/:id', auth, updateProposalById);

module.exports = router;
