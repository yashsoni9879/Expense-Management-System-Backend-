const express = require("express");
const Category = require("../models/category.model.js");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
} = require("../services/category.service.js");
const { authMidddleware } = require("../middlewares/auth.middleware.js");
const routCategory = express.Router();

// login (public)
routCategory.post("/login", async (req, res) => {
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
