const mongoose = require("mongoose");
const { FileDBConnection } = require("../db/db");

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  uploaderName: {
    type: String,
    required: true
  },
});

const File = FileDBConnection.model("File", fileSchema);
module.exports = File;
