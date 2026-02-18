const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNo: { type: String },
  profileImage: String
},{
  timestamps:{ createdAt:"created", updatedAt:"modified" }
});

module.exports = mongoose.model("User", userSchema);
