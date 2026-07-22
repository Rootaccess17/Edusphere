const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const {
  XP_PER_LESSON,
  XP_PER_QUIZ_PASS,
  updateStreak,
  addXP,
  checkAndAwardBadges,
} = require("../utils/gamification");

// POST /api/enrollments  (student only)
async function enrollInCourse(req, res) {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const existing = await Enrollment.findOne({ student: req.userId, course: courseId });
    if (existing) {
      return res.status(200).json(existing);
    }

    const enrollment = await Enrollment.create({
      student: req.userId,
      course: courseId,
      completedLessons: [],
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/enrollments/my  (student only)
async function getMyEnrollments(req, res) {
  try {
    const enrollments = await Enrollment.find({ student: req.userId })
      .populate("course", "title thumbnail category price")
      .sort({ createdAt: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/enrollments/course/:courseId  (student only)
async function getMyEnrollment(req, res) {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.userId,
      course: req.params.courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in this course" });
    }

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// PATCH /api/enrollments/:id/complete-lesson  (student only)
async function markLessonComplete(req, res) {
  try {
    const { lessonId } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.student.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let gamification = null;

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      await enrollment.save();

      // Award XP for this lesson
      await addXP(req.userId, XP_PER_LESSON);

      // Update daily streak
      await updateStreak(req.userId);

      // Count this student's total completed lessons across ALL courses
      const allEnrollments = await Enrollment.find({ student: req.userId });
      const totalLessonsCompleted = allEnrollments.reduce(
        (sum, e) => sum + e.completedLessons.length,
        0
      );

      const newBadges = await checkAndAwardBadges(req.userId, { totalLessonsCompleted });

      gamification = { xpGained: XP_PER_LESSON, newBadges };
    }

    res.status(200).json({ enrollment, gamification });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}


// GET /api/enrollments/instructor-students
async function getInstructorStudents(req, res) {
  try {
    const courses = await Course.find({ instructor: req.userId });
    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student", "name email")
      .populate("course", "title");

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { enrollInCourse, getMyEnrollment, markLessonComplete, getMyEnrollments, getInstructorStudents };