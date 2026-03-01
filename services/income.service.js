const Income = require("../models/income.model.js");

const getAll = async (req, res) => {
  try {
    console.log("get all income api called");
    const incomes = await Income.find();
    res.json({ message: "income fetched successfully", allincomes: incomes });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "income not found" });
    }
    res.json({ message: "income fetched successfully", income: income });
  } catch (err) {
    res.status(500).send(err);
  }
};

const insert = async (req, res) => {
  try {
    console.log("insert income api called with data:", req.body);

    const { incomeDate, peopleId, amount, userId } = req.body;

    const newincome = await Income.create({
      incomeDate,
      peopleId,
      amount,
      userId,
    });

    res.json({ message: "user created successfully", income: newincome });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!income) {
      return res.status(404).json({ message: "income not found" });
    }
    res.json({ message: "income updated successfully", income: income });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.json({ message: "income deleted successfully", income: income });
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
