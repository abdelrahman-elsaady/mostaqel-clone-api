

const express = require("express");
let router = express.Router();
let {auth,restrictTo}=require('../middlewares/authorization')
let {
  saveCategories,
  showCategories,
  deleteCategories,
  updateCategoriesById,
} = require("../controllers/categories");

router.get("/", showCategories);
router.post('/', auth, restrictTo('admin'), saveCategories);
router.delete('/:id', auth, restrictTo('admin'), deleteCategories);
router.patch('/:id', auth, restrictTo('admin'), updateCategoriesById);

module.exports = router;
