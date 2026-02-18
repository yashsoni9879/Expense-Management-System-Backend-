const express = require("express");
const Income = require("../models/income.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
} = require("../services/income.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");
const routIncome = express.Router();

routIncome.use(authMidddleware);

// get all
routIncome.get("/", getAll);

// get by id
routIncome.get("/:id", getByID);

//login
routIncome.post("/login", async (req, res) => {
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
routIncome.post("/", insert);

// edit
routIncome.patch("/:id", update);

// delete
routIncome.delete("/:id", remove);

module.exports = routIncome;
