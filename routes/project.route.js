const express = require("express");
const Project = require("../models/project.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
} = require("../services/project.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");
const routProject = express.Router();

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
