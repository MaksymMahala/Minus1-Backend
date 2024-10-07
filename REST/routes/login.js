// routes/login.js
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Models/Users"); // Import the User model
const router = express.Router();

router.post("/loginUser", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during login: " + error.message });
  }
});

module.exports = router;
