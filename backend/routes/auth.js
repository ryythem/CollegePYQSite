const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../model/userSchema.js");
const bcrypt = require("bcrypt");

const router = express.Router();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email.endsWith("@smit.smu.edu.in")) {
    return res
      .status(400)
      .json({ message: "Only SMIT college students allowed" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists, Please log in" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const otpSent = await sendOTP(email, otp);
    if (!otpSent.success) {
      return res
        .status(500)
        .json({ message: "Error sending OTP", error: otpSent.error });
    }

    await User.create({ email, password: hashedPassword, otp, otpExpiry });

    return res.json({ message: "OTP sent! Please verify your email" });
  } catch (e) {
    return res.status(500).json({ message: "SignUp failed", error: e.message });
  }
});

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { ciphers: "SSLv3" },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.verified) {
      return res
        .status(400)
        .json({ message: "User already verified! Please log in" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Email successfully verified! You can log in now" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "OTP verification failed", error: e.message });
  }
});

module.exports = router;
