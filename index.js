const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyyhzcl.mongodb.net/todoDB?retryWrites=true&w=majority`;
const options = {};

const DBConnection = () => {
  try {
    mongoose.connect(uri, options);
    console.log("Connection Successful");
  } catch (err) {
    console.error("Connection Error:", err);
  }
};

DBConnection();

// Define file schema
const fileSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const File = mongoose.model("File", fileSchema);

const upload = multer();

// Middleware
app.use(cors());
app.use(express.json());

// Upload file and save to database
app.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = new File({
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

// Retrieve file data from database
app.get("/file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.set("Content-Type", file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Add a new endpoint to serve the file data
app.get("/download-file/:id", async (req, res) => {
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

app.get("/", (req, res) => {
  res.send("pdf to qr network is running...");
});

app.listen(port, () => {
  console.log(`pdf to qr API is running on port: ${port}`);
});
