const express = require("express");
const User = require("../models/user.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
} = require("../services/users.service.js");

const { authMidddleware } = require("../middlewares/auth.middleware.js");

const routUser = express.Router();

//login (public)
routUser.post("/login", async (req, res) => {
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

routUser.use(authMidddleware);

// get all
routUser.get("/", getAll);

// get by id
routUser.get("/:id", getByID);

// insert
routUser.post("/", insert);

// edit
routUser.patch("/:id", update);

// delete
routUser.delete("/:id", remove);

module.exports = routUser;
