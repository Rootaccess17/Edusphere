const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// For course thumbnail images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "edusphere/course-thumbnails",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// For lesson videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "edusphere/lesson-videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "webm"],
  },
});

const upload = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { upload, uploadVideo };