const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fileSchema = require("../schema/fileSchema");
const router = express.Router();
const upload = multer();

const File = mongoose.model("File", fileSchema);

router.get("/", async (req, res) => {
  res.send("file end point for get");
});

// Upload file and save to database
router.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = new File({ // Change this line
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await file.save();

    res.json({ fileId: file._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Add a new endpoint to serve the file data
router.get("/download-file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", "attachment; filename=file.pdf");
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
