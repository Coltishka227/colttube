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

app.post(
  "/upload",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  (req, res) => {
    console.log(req.files);
    console.log(req.body);

    if (!req.files || !req.files.video) {
      return res.status(400).json({
        error: "No video uploaded"
      });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail
      ? req.files.thumbnail[0]
      : null;

    res.json({
      success: true,
      video: videoFile.filename,
      thumbnail: thumbnailFile ? thumbnailFile.filename : null,
      title: req.body.title,
      description: req.body.description
    });
  }
);

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