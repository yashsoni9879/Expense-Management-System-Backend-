const express = require("express");
const Expense = require("../models/expense.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
} = require("../services/expense.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");
const routExpense = express.Router();

routExpense.use(authMidddleware);

// get all
routExpense.get("/", getAll);

// get by id
routExpense.get("/:id", getByID);

//login
routExpense.post("/login", async (req, res) => {
  try {
    const data = await checkLogin(req.body);
    res.status(data.error ? 401 : 200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: true,
      message: err.message,
    });
  }
});

// insert
routExpense.post("/", insert);

// edit
routExpense.patch("/:id", update);

// delete
routExpense.delete("/:id", remove);

module.exports = routExpense;
