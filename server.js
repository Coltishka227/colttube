const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// ===== CHECK FOLDERS =====
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ===== ROUTES =====

// upload video
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "Uploaded successfully",
    file: req.file.filename
  });
});

// get videos list
app.get("/videos", (req, res) => {
  const files = fs.readdirSync("uploads");
  res.json(files);
});

// API check
app.get("/api", (req, res) => {
  res.json({ status: "ColtTube running 🚀" });
});

// IMPORTANT: frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});