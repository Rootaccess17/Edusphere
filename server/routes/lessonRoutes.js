const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { uploadVideo } = require("../middleware/uploadMiddleware");
const { createLesson, getLessonsByCourse } = require("../controllers/lessonController");

const router = express.Router();

router.get("/course/:courseId", getLessonsByCourse);
router.post("/", protect, requireRole("instructor"), uploadVideo.single("video"), createLesson);

module.exports = router;