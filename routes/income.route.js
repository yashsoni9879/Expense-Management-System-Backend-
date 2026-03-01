const express = require("express");
const Income = require("../models/income.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
} = require("../services/income.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");
const routIncome = express.Router();

routIncome.use(authMidddleware);

// get all
routIncome.get("/", getAll);

// get by id
routIncome.get("/:id", getByID);

// insert
routIncome.post("/", insert);

// edit
routIncome.patch("/:id", update);

// delete
routIncome.delete("/:id", remove);

module.exports = routIncome;
