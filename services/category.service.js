const Category = require("../models/category.model.js");

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return undefined;
};

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

    const {
      categoryName,
      userId,
      logoPath,
      description,
      sequence,
      isActive,
      isExpense: isExpenseRaw,
      isIncome: isIncomeRaw,
      isExpence: isExpenceRaw,
      categoryType,
    } = req.body;

    let isExpense = parseBoolean(isExpenseRaw);
    if (isExpense === undefined) {
      isExpense = parseBoolean(isExpenceRaw);
    }

    let isIncome = parseBoolean(isIncomeRaw);

    if (
      isExpense === undefined &&
      isIncome === undefined &&
      typeof categoryType === "string"
    ) {
      const normalizedType = categoryType.trim().toLowerCase();
      if (["expense", "expence"].includes(normalizedType)) {
        isExpense = true;
        isIncome = false;
      } else if (normalizedType === "income") {
        isExpense = false;
        isIncome = true;
      }
    }

    const payload = {
      categoryName,
      userId,
      logoPath,
      description,
      sequence,
      isActive,
    };

    if (isExpense !== undefined) payload.isExpense = isExpense;
    if (isIncome !== undefined) payload.isIncome = isIncome;

    const newcategory = await Category.create(payload);

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
