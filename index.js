const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const UPLOAD_FOLDER = "./uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Make the upload folder static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload-file", upload.single("file"), (req, res) => {
  if (req.file.path) {
    res.json({ path: req.file.path });
  }else{
    res.json({error: "Something Went wrong..!!!"});
  }
});

app.get("/", (req, res) => {
  res.send("pdf to qr network is running...");
});

app.listen(port, (req, res) => {
  console.log(`pdf to qr API is running on port: ${port}`);
});
