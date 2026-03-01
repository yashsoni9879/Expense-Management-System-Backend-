const express = require("express");
const Category = require("../models/category.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
} = require("../services/category.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");
const routCategory = express.Router();

routCategory.use(authMidddleware);

// get all
routCategory.get("/", getAll);

// get by id
routCategory.get("/:id", getByID);

// insert
routCategory.post("/", insert);

// edit
routCategory.patch("/:id", update);

// delete
routCategory.delete("/:id", remove);

module.exports = routCategory;
