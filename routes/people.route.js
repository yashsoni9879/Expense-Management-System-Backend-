const express = require("express");
const People = require("../models/people.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
} = require("../services/people.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");

const routPeople = express.Router();

routPeople.use(authMidddleware);

// get all
routPeople.get("/", getAll);

// get by id
routPeople.get("/:id", getByID);

// insert
routPeople.post("/", insert);

// edit
routPeople.patch("/:id", update);

// delete
routPeople.delete("/:id", remove);

module.exports = routPeople;
