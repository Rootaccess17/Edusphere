const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  createSession,
  getMySessions,
  toggleComplete,
  deleteSession,
} = require("../controllers/studySessionController");

const router = express.Router();

router.post("/", protect, requireRole("student"), createSession);
router.get("/", protect, requireRole("student"), getMySessions);
router.patch("/:id/toggle-complete", protect, requireRole("student"), toggleComplete);
router.delete("/:id", protect, requireRole("student"), deleteSession);

module.exports = router;