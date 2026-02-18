const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB!!!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const app = express();
app.use(express.json());

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

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
