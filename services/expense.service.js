const Expense = require("../models/expense.model.js");

const getAll = async (req, res) => {
  try {
    console.log("get all expense api called");
    const expense = await Expense.find();
    res.json({ message: "expense fetched successfully", allexpense: expense });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    res.json({ message: "expense fetched successfully", expense: expense });
  } catch (err) {
    res.status(500).send(err);
  }
};

const insert = async (req, res) => {
  try {
    console.log("insert expense api called with data:", req.body);

    const { expenseDate, peopleId, amount, userId } = req.body;

    const newexpense = await Expense.create({
      expenseDate,
      peopleId,
      amount,
      userId,
    });

    res.json({ message: "expense created successfully", expense: newexpense });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    res.json({ message: "expense updated successfully", expense: expense });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    res.json({ message: "expense deleted successfully", expense: expense });
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
