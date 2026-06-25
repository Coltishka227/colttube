const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// загрузка видео
app.post("/upload", upload.single("video"), (req, res) => {
  res.json({
    message: "Uploaded",
    file: req.file.filename
  });
});

// список файлов
app.get("/videos", (req, res) => {
  const fs = require("fs");
  const files = fs.readdirSync("uploads");
  res.json(files);
});

app.get("/", (req, res) => {
  res.send("ColtTube is running 🚀");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});