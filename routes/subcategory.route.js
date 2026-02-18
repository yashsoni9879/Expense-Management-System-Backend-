const express = require("express");
const mongoose = require("mongoose");
const Subcategory = require("../models/subcategory.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
} = require("../services/users.service.js");

const { authMidddleware } = require("../middlewares/auth.middleware.js");

const routSubcategory = express.Router();
routSubcategory.use(authMidddleware);

//get all
routSubcategory.get("/", getAll);

//get by id
routSubcategory.get("/:id", getByID);

//login
routSubcategory.post("/login", async (req, res) => {
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
routSubcategory.post("/", insert);

// edit
routSubcategory.patch("/:id", update);

// delete
routSubcategory.delete("/:id", remove);

module.exports = routSubcategory;
