const Subcategory = require("../models/subcategory.model.js");

const getAll = async (req, res) => {
  try {
    console.log("get all subcategory api called");
    const subcategory = await Subcategory.find();
    res.json({
      message: "subcategory fetched successfully",
      allsubcategory: subcategory,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({
      message: "subcategory fetched successfully",
      subcategory: subcategory,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const insert = async (req, res) => {
  try {
    console.log("insert subcategory api called with data:", req.body);

    const { subCategoryName, description, categoryId, userId, logoPath } =
      req.body;

    const newSubcategory = await Subcategory.create({
      subCategoryName,
      description,
      categoryId,
      userId,
      logoPath,
    });

    res.json({
      message: "subcategory created successfully",
      subcategory: newSubcategory,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({
      message: "subcategory updated successfully",
      subcategory: subcategory,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({
      message: "subcategory deleted successfully",
      subcategory: subcategory,
    });
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
