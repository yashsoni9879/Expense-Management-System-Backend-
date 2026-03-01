const express = require("express");
const Expense = require("../models/expense.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
} = require("../services/expense.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");
const routExpense = express.Router();

routExpense.use(authMidddleware);

// get all
routExpense.get("/", getAll);

// get by id
routExpense.get("/:id", getByID);

// insert
routExpense.post("/", insert);

// edit
routExpense.patch("/:id", update);

// delete
routExpense.delete("/:id", remove);

module.exports = routExpense;
