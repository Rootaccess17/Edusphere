const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createDiscussion,
  getDiscussionsByCourse,
  addReply,
} = require("../controllers/discussionController");

const router = express.Router();

router.post("/", protect, createDiscussion);
router.get("/course/:courseId", protect, getDiscussionsByCourse);
router.post("/:id/reply", protect, addReply);

module.exports = router;