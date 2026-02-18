const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  incomeDate: { type: Date, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  peopleId: { type: mongoose.Schema.Types.ObjectId, ref: "People", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  amount: { type: Number, required: true },
  incomeDetail: String,
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

module.exports = mongoose.model("Income", incomeSchema);
