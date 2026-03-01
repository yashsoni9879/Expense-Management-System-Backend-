const express = require("express");
const Project = require("../models/project.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
} = require("../services/users.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");
const routProject = express.Router();

// login (public)
routProject.post("/login", async (req, res) => {
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

routProject.use(authMidddleware);

// get all
routProject.get("/", getAll);

// get by id
routProject.get("/:id", getByID);

// insert
routProject.post("/", insert);

// edit
routProject.patch("/:id", update);

// delete
routProject.delete("/:id", remove);

module.exports = routProject;
