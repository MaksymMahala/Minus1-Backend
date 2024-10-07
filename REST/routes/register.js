// routes/register.js
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../Models/Users");
const router = express.Router();
const otpStore = {};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendOTPEmail(toEmail, otp) {
  const mailOptions = {
    from: `"Minus1Group" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

router.post("/send-otpcode", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const otp = generateOTP();
  otpStore[email] = { otp, password };
  sendOTPEmail(email, otp);

  res.status(200).json({ message: "OTP sent to your email" });
  console.log("Email sent with OTP:", otp);
});

// Verify OTP and Register User
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  // Ensure email and otp are provided
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedData = otpStore[email];

  // Check if OTP is valid
  if (storedData && storedData.otp === otp) {
    const existingUser = await User.findOne({ email });

    // Check if the user already exists
    if (existingUser) {
      console.log("User already exists.");
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(storedData.password, 10); // Hash the password

    const newUser = new User({
      email,
      password: hashedPassword,
      balance: 0,
    });

    try {
      await newUser.save();
      console.log("User registered successfully");
      delete otpStore[email]; // Clear the OTP after registration
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.log("Error saving user: " + error.message);
      return res
        .status(500)
        .json({ message: "Error saving user: " + error.message });
    }
  } else {
    console.log("Invalid OTP");
    return res.status(400).json({ message: "Invalid OTP" });
  }
});

module.exports = router;
