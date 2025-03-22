const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../model/userSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTPModel = require("../model/otpSchema.js");

const router = express.Router();

// OTP Generator Function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email

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
      return res.status(400).json({
        success: false,
        message: "User already exists, Please log in",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const otpSent = await sendOTP(email, otp);
    if (!otpSent.success) {
      return res.status(500).json({
        success: false,
        message: "Error sending OTP",
        error: otpSent.error,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await OTPModel.findOneAndUpdate(
      { email },
      { otp, otpExpiry, password: hashedPassword },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      message: "OTP sent! Please verify your email",
    });
  } catch (e) {
    return res.status(500).json({ message: "SignUp failed", error: e.message });
  }
});

//Resend OTP Route

router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await OTPModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const otpSent = await sendOTP(email, otp);

    if (!otpSent.success) {
      return res.status(500).json({
        success: false,
        message: "Error sending the OTP",
      });
    }

    await OTPModel.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiry,
      },
      {
        upsert: true,
        new: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "New OTP sent! Please check your email",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Resend OTP failed",
    });
  }
});

// Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Otp expired" });
    }

    if (otpRecord.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date(otpRecord.otpExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    await User.create({ email, password: otpRecord.password });

    await OTPModel.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Email successfully verified! You can log in now",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: e.message,
    });
  }
});

//forgot password route

router.post("/forgot-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const otpSent = await sendOTP(email, otp);
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!otpSent.success) {
      return res.status(400).json({
        success: false,
        message: "Error sending OTP",
      });
    }

    await OTPModel.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiry,
        password: hashedPassword,
      },
      { upsert: true, new: true }
    );
    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully! Please check your email",
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Error resetting the password" });
  }
});

//To verify OTP for forgot password
router.post("/verify-otp2", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP Expired",
      });
    }

    if (otpRecord.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    if (new Date(otpRecord.otpExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    await User.findOneAndUpdate({ email }, { password: otpRecord.password });
    await OTPModel.deleteOne({ email });
    return res.status(200).json({
      success: true,
      message: "Password has been changed successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (e) {
    return res.status(500).json({ message: "Login failed", error: e.message });
  }
});

module.exports = router;
