const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
