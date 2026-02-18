const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
  peopleCode: String,
  password: { type: String, required: true },
  peopleName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNo: String,
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: { type: Boolean, default: true }
},{
  timestamps: { createdAt: "created", updatedAt: "modified" }
});

module.exports = mongoose.model("People", peopleSchema);
