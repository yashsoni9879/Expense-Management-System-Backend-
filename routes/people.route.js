const express = require("express");
const People = require("../models/people.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
} = require("../services/people.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");

const routPeople = express.Router();

// login (public)
routPeople.post("/login", async (req, res) => {
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
