const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Create uploads folder if missing
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("video"), (req, res) => {
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded"
    });
  }

  res.json({
    filename: req.file.filename,
    url: "/uploads/" + req.file.filename
  });
});

// Videos list
app.get("/videos", (req, res) => {
  const files = fs.readdirSync("uploads");

  const videos = files
    .filter(file => file !== "test.txt")
    .map(file => ({
      name: file,
      url: "/uploads/" + file
    }));

  res.json(videos);
});

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log("ColtTube running on port", PORT);
});