const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { createQuiz, getQuizForStudent, submitQuiz } = require("../controllers/quizController");

const router = express.Router();

router.post("/", protect, requireRole("instructor"), createQuiz);
router.get("/course/:courseId", protect, requireRole("student"), getQuizForStudent);
router.post("/:id/submit", protect, requireRole("student"), submitQuiz);

module.exports = router;