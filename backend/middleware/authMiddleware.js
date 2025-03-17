require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema.js");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized token",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized : User not found",
      });
    }
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
};

module.exports = authMiddleware;
