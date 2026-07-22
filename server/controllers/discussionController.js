const Discussion = require("../models/Discussion");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const createNotification = require("../utils/notify");

// Helper: confirm the user is either enrolled in the course OR is its instructor
async function canAccessCourseForum(userId, userRole, courseId) {
  if (userRole === "instructor") {
    const course = await Course.findById(courseId);
    return course && course.instructor.toString() === userId.toString();
  }

  if (userRole === "student") {
    const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
    return !!enrollment;
  }

  return false;
}

// POST /api/discussions
async function createDiscussion(req, res) {
  try {
    const { courseId, message } = req.body;

    if (!courseId || !message) {
      return res.status(400).json({ message: "Course and message are required" });
    }

    const allowed = await canAccessCourseForum(req.userId, req.userRole, courseId);
    if (!allowed) {
      return res.status(403).json({ message: "You must be enrolled to post here" });
    }

    const discussion = await Discussion.create({
      course: courseId,
      author: req.userId,
      message,
    });

    const populated = await discussion.populate("author", "name role");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/discussions/course/:courseId
async function getDiscussionsByCourse(req, res) {
  try {
    const allowed = await canAccessCourseForum(req.userId, req.userRole, req.params.courseId);
    if (!allowed) {
      return res.status(403).json({ message: "You must be enrolled to view this forum" });
    }

    const discussions = await Discussion.find({ course: req.params.courseId })
      .populate("author", "name role")
      .populate("replies.author", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// POST /api/discussions/:id/reply
async function addReply(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    const allowed = await canAccessCourseForum(req.userId, req.userRole, discussion.course);
    if (!allowed) {
      return res.status(403).json({ message: "You must be enrolled to reply here" });
    }

    discussion.replies.push({ author: req.userId, message });
    await discussion.save();

    // Notify the original poster (if someone else replied to them)
    if (discussion.author.toString() !== req.userId.toString()) {
      await createNotification(
        discussion.author,
        "Someone replied to your discussion post",
        `/learn/${discussion.course}`
      );
    }

    const populated = await discussion.populate([
      { path: "author", select: "name role" },
      { path: "replies.author", select: "name role" },
    ]);

    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { createDiscussion, getDiscussionsByCourse, addReply };