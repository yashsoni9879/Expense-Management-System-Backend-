const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/expense_db";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const routUser = require("./routes/users.route.js");
app.use("/users", routUser);

const routSubcategory = require("./routes/subcategory.route.js");
app.use("/subcategory", routSubcategory);

const routProject = require("./routes/project.route.js");
app.use("/project", routProject);

const routPeople = require("./routes/people.route.js");
app.use("/people", routPeople);

const routIncome = require("./routes/income.route.js");
app.use("/income", routIncome);

const routExpense = require("./routes/expense.route.js");
app.use("/expense", routExpense);

const routCategory = require("./routes/category.route.js");
app.use("/category", routCategory);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
