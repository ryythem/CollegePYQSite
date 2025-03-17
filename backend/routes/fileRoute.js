const multer = require("multer");
const express = require("express");
const { bucket } = require("../firebase.js");
const File = require("../model/fileSchema.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
const filenamePattern =
  /^[A-Za-z]+_Sem\d+_(MidSem|EndSem|Quiz\d)_\d{4}\.[a-zA-Z0-9]+$/;

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file found" });
    }

    try {
      const file = req.file;
      const filename = file.originalname;
      const userId = req.user._id;

      if (!filenamePattern.test(filename)) {
        return res.status(400).json({
          message:
            "Invalid filename! Upload the file in the required format. Use: Course_Semester_ExamType_Year.extension (e.g., COA_Sem3_EndSem_2024.pdf)",
        });
      }

      const fileRef = bucket.file(filename);

      const [exists] = await fileRef.exists();
      if (exists) {
        return res.status(400).json({ message: "File already exists" });
      }

      const blobStream = fileRef.createWriteStream({
        metadata: { contentType: file.mimetype },
      });

      blobStream.on("error", (err) => {
        return res
          .status(400)
          .json({ message: "File upload failed", error: err.message });
      });

      blobStream.on("finish", async () => {
        await fileRef.makePublic();
        const fileURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;

        const newFile = new File({
          userId,
          filename,
          url: fileURL,
        });

        await newFile.save();
        res
          .status(200)
          .json({ message: "File uploaded successfully", fileURL });
      });

      blobStream.end(file.buffer);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Upload failed", error: error.message });
    }
  }
);

router.get("/my-uploads", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const files = await File.find({ userId });
    return res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch the files" });
  }
});

router.delete("/delete-file/:fileId", authMiddleware, async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }
    
    const fileRef = bucket.file(file.filename);
    fileRef.delete();
    await File.findByIdAndDelete(fileId);
    return res.status(200).json({
      success: true,
      message: "File successfully deleted",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
});

module.exports = router;
