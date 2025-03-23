const multer = require("multer");
const express = require("express");
const { bucket } = require("../firebase.js");
const File = require("../model/fileSchema.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
const filenamePattern =
  /^[A-Za-z]+_Sem\d+_(MidSem|EndSem|Quiz\d+)_\w+_\d{4}(-\d{2})?\.(pdf)$/;

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
      const username = req.user.email.split("_")[0];
      const userName = username[0].toUpperCase() + username.slice(1);

      if (!filenamePattern.test(filename)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid filename! Upload the file in the required format. Use: Course_Semester_ExamType_Dept_Year.extension (e.g., COA_Sem3_EndSem_Btech_2024.pdf)",
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
          uploaderName: userName,
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

// router.get("/all", async (req, res) => {
//   try {
//     const files = await File.find();
//     if (files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No files found",
//       });
//     }
//     const filesList = files.map((file) => ({
//       filename: file.filename,
//       url: file.url,
//     }));
//     return res.status(200).json({
//       success: true,
//       files: filesList,
//     });
//   } catch (e) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Error fetching files" });
//   }
// });

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const files = await File.find({
      filename: { $regex: query, $options: "i" },
    });

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files with this name",
      });
    }
    const filesList = files.map((file) => ({
      filename: file.filename,
      url: file.url,
      uploaderName: file.uploaderName,
    }));

    res.status(200).json({
      success: true,
      files: filesList,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Error fetching files",
    });
  }
});

router.get("/top-contributors", async (req, res) => {
  try {
    const topContributors = await File.aggregate([
      {
        $group: {
          _id: "$uploaderName",
          uploadCount: { $sum: 1 },
        },
      },
      {
        $sort: { uploadCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      topContributors,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
    });
  }
});

module.exports = router;
