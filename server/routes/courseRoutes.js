const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  getMyCourses,
} = require("../controllers/courseController");

const router = express.Router();

// Public routes
router.get("/", getAllCourses);
router.get("/my-courses", protect, requireRole("instructor"), getMyCourses);
router.get("/:id", getCourseById);

// Instructor-only route
router.post("/", protect, requireRole("instructor"), upload.single("thumbnail"), createCourse);

module.exports = router;