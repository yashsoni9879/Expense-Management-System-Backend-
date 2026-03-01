const express = require("express");
const {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
} = require("../services/subcategory.service.js");

const { authMidddleware } = require("../middlewares/auth.middleware.js");

const routSubcategory = express.Router();

// login (public)
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
