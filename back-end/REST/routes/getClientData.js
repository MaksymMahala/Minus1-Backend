const express = require("express");
const router = express.Router();
const userSchema = require("../Models/Users");

router.post("/get-clientData", async (req, res) => {
  const email = req.query.email; // Extract email from the query string
  const userData = req.body; // Extract user data from the request body

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Check if user already exists by email
    const existingUser = await userSchema.findOne({ email });

    if (existingUser) {
      // If the user exists, update the data
      const updatedUser = await userSchema.findOneAndUpdate(
        { email },
        { $set: userData },
        { new: true } // Return the updated document
      );

      res.status(200).json(updatedUser);
    } else {
      // If the user does not exist, create a new user
      const newUser = new userSchema({
        email,
        ...userData, // Spread the provided user data into the new user document
      });

      await newUser.save();
      res.status(201).json(newUser); // Return the created user
    }
  } catch (error) {
    console.error("Error saving/updating user data:", error.message);
    res.status(500).json({ error: "An error occurred while saving data" });
  }
});

module.exports = router;
