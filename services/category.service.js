const Category = require("../models/category.model.js");

const getAll = async (req, res) => {
  try {
    console.log("get all category api called");
    const category = await Category.find();
    res.json({
      message: "category fetched successfully",
      allcategory: category,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    res.json({ message: "category fetched successfully", category: category });
  } catch (err) {
    res.status(500).send(err);
  }
};

const insert = async (req, res) => {
  try {
    console.log("insert category api called with data:", req.body);

    const { categoryName, userId } = req.body;

    const newcategory = await Category.create({
      categoryName,
      userId,
    });

    res.json({
      message: "category created successfully",
      category: newcategory,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    res.json({ message: "category updated successfully", category: category });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "category not found" });
    }
    res.json({ message: "category deleted successfully", category: category });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAll,
  getByID,
  insert,
  update,
  remove,
};
