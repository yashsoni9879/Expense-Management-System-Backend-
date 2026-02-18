const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  expenseDate: { type: Date, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  peopleId: { type: mongoose.Schema.Types.ObjectId, ref: "People", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  amount: { type: Number, required: true },
  expenseDetail: String,
  attachmentPath: String,
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},{
  timestamps: { createdAt: "created", updatedAt: "modified" }
});

module.exports = mongoose.model("Expense", expenseSchema);
