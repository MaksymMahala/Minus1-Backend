require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../Models/Users");
const router = express.Router();
const otpStore = {};

// Function to generate OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP email to user
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

// Route to send OTP code
router.post("/send-otpcode", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const otp = generateOTP();
  otpStore[email] = { otp };
  sendOTPEmail(email, otp);

  res.status(200).json({ message: "OTP sent to your email" });
  console.log("Email sent with OTP:", otp);
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedData = otpStore[email];

  if (storedData && storedData.otp === otp) {
    console.log("OTP verified successfully");
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    console.log("Invalid OTP");
    return res.status(400).json({ message: "Invalid OTP" });
  }
});

router.post("/register", async (req, res) => {
  const { email, userName, phoneNumber, password } = req.body;

  if (!userName || !phoneNumber || !email || !password) {
    return res.status(400).json({
      message:
        "All fields (userName, phoneNumber, email, password, otp) are required.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const newUser = new User({
      userName,
      phoneNumber,
      email,
      password: hashedPassword,
      balance: 0,
    });

    await newUser.save();
    console.log("User registered successfully");

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.log("Error saving user: " + error.message);
    return res
      .status(500)
      .json({ message: "Error saving user: " + error.message });
  }
});

module.exports = router;
