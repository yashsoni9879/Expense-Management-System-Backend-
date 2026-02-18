const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectLogo: String,
  projectStartDate: Date,
  projectEndDate: Date,
  projectDetail: String,
  description: String,
  isActive: { type: Boolean, default: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},{
  timestamps: { createdAt: "created", updatedAt: "modified" }
});

module.exports = mongoose.model("Project", projectSchema);
