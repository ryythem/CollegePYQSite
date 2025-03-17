const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 120 });

const OTPModel = mongoose.model("OTP", otpSchema);
module.exports = OTPModel;
