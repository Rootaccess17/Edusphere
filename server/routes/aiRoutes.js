const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getStatus,
  explainConcept,
  generateQuiz,
  generateStudyPlan,
  chat,
} = require("../controllers/aiController");

const router = express.Router();

router.get("/status", protect, getStatus);
router.post("/explain", protect, explainConcept);
router.post("/quiz", protect, generateQuiz);
router.post("/study-plan", protect, generateStudyPlan);
router.post("/chat", protect, chat);

module.exports = router;