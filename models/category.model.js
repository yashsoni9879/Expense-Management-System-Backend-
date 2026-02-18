const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  logoPath: String,
  isExpense: { type: Boolean, default: false },
  isIncome: { type: Boolean, default: false },
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

module.exports = mongoose.model("Category", categorySchema);
