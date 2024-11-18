// routes/profile.js
const express = require("express");
const User = require("../Models/Users");
const router = express.Router();

// Route to update user profile
router.post("/edit-profile", async (req, res) => {
  const { email, userName, phoneNumber } = req.body;

  // Validate the input data
  if (!email || !userName || !phoneNumber) {
    return res.status(400).json({
      message: "All fields (email, userName, phoneNumber) are required.",
    });
  }

  try {
    // Find the user by email (you can use another unique identifier like _id)
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user fields
    user.userName = userName;
    user.phoneNumber = phoneNumber;

    // Save the updated user data to the database
    await user.save();

    console.log("User profile updated successfully");

    // Return the updated user information, excluding the password
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        balance: user.balance, // Or any other fields you want to return
      },
    });
  } catch (error) {
    console.log("Error updating user profile: " + error.message);
    return res.status(500).json({
      message: "Error updating user profile: " + error.message,
    });
  }
});

module.exports = router;
