const categoriesModel = require("../models/categories");

let showCategories = async (req, res) => {
  try {
    let categories = await categoriesModel.find();
    res.status(200).json({ message: "success", categories });
  } catch (err) {
    res.status(404).json(err);
  }
};

let saveCategories = async (req, res) => {
  let newCategories = req.body;
  try {
    let savedUser = await categoriesModel.create(newCategories);
    res
      .status(200)
      .json({ message: "categories saved successfully", data: savedUser });
  } catch (err) {
    res.status(404).json(err.message);
  }
};
let updateCategoriesById = async (req, res) => {

  try {
    let updatecategory = await categoriesModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "category updated successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

let deleteCategories = async (req, res) => {
  let { id } = req.params;
  try {
    let categor = await categoriesModel.findByIdAndDelete(id);

    if (categor) {
      res.status(200).json({ messege: "success" });
    } else {
      res.status(400).json({ message: "category doesn't exist" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  showCategories,
  saveCategories,
  updateCategoriesById,
  deleteCategories,
};
