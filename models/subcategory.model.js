const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subCategoryName: { type: String, required: true },
  logoPath: String,
  isExpense: Boolean,
  isIncome: Boolean,
  isActive: { type: Boolean, default: true },
  description: String,
  sequence: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},{
  timestamps: { createdAt: "created", updatedAt: "modified" }
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
