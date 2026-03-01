const express = require("express");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
} = require("../services/subcategory.service.js");

const { authMidddleware } = require("../middlewares/auth.middleware.js");

const routSubcategory = express.Router();

routSubcategory.use(authMidddleware);

// get all
routSubcategory.get("/", getAll);

// get by id
routSubcategory.get("/:id", getByID);

// insert
routSubcategory.post("/", insert);

// edit
routSubcategory.patch("/:id", update);

// delete
routSubcategory.delete("/:id", remove);

module.exports = routSubcategory;
