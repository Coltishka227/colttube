const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

let videos = [];

app.post("/upload", upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.files.video) {
            return res.status(400).json({
                success: false,
                message: "Видео не загружено"
            });
        }

        const videoFile = req.files.video[0].filename;

        const thumbnailFile = req.files.thumbnail
            ? req.files.thumbnail[0].filename
            : null;

        const video = {
            id: Date.now(),
            title,
            description,
            file: videoFile,
            thumbnail: thumbnailFile
        };

        videos.push(video);

        res.json({
            success: true,
            video
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Ошибка загрузки"
        });
    }
});

app.get("/videos", (req, res) => {
    res.json(videos);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("ColtTube запущен");
});