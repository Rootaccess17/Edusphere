const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  enrollInCourse,
  getMyEnrollment,
  markLessonComplete,
  getMyEnrollments,
  getInstructorStudents,
} = require("../controllers/enrollmentController");
const router = express.Router();

router.get("/my", protect, requireRole("student"), getMyEnrollments);
router.post("/", protect, requireRole("student"), enrollInCourse);
router.get("/course/:courseId", protect, requireRole("student"), getMyEnrollment);
router.patch("/:id/complete-lesson", protect, requireRole("student"), markLessonComplete);
router.get("/instructor-students", protect, requireRole("instructor"), getInstructorStudents);

module.exports = router;