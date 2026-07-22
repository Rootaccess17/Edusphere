const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// POST /api/lessons  (instructor only — must own the course)
async function createLesson(req, res) {
  try {
    const { courseId, title, order } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ message: "Course and title are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "You do not own this course" });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      videoUrl: req.file ? req.file.path : "",
      order: order || 0,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/lessons/course/:courseId
async function getLessonsByCourse(req, res) {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({
      order: 1,
    });
    res.status(200).json(lessons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { createLesson, getLessonsByCourse };
