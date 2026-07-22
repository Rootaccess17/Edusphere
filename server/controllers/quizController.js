const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const {
  XP_PER_QUIZ_PASS,
  addXP,
  updateStreak,
  checkAndAwardBadges,
} = require("../utils/gamification");
const createNotification = require("../utils/notify");

// POST /api/quizzes  (instructor only — must own the course)
async function createQuiz(req, res) {
  try {
    const { courseId, title, questions } = req.body;

    if (!courseId || !title || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Course, title, and questions are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "You do not own this course" });
    }

    const quiz = await Quiz.create({ course: courseId, title, questions });
    res.status(201).json(quiz);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/quizzes/course/:courseId  (student — questions WITHOUT correct answers)
async function getQuizForStudent(req, res) {
  try {
    const quiz = await Quiz.findOne({ course: req.params.courseId });

    if (!quiz) {
      return res.status(404).json({ message: "No quiz found for this course" });
    }

    // Strip out correctOptionIndex before sending to the student
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
      })),
    };

    res.status(200).json(safeQuiz);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

// POST /api/quizzes/:id/submit  (student only)
async function submitQuiz(req, res) {
  try {
    const { answers, enrollmentId } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    quiz.questions.forEach((question) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === question._id.toString(),
      );
      if (
        studentAnswer &&
        studentAnswer.selectedOptionIndex === question.correctOptionIndex
      ) {
        score += 1;
      }
    });

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.student.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    enrollment.quizResults.push({
      quiz: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
    });
    await enrollment.save();

    const percentage = (score / quiz.questions.length) * 100;
    let gamification = null;

    if (percentage >= 50) {
      await addXP(req.userId, XP_PER_QUIZ_PASS);
      await updateStreak(req.userId);

      const newBadges = await checkAndAwardBadges(req.userId, {
        hasPerfectQuizScore: percentage === 100,
      });

      gamification = { xpGained: XP_PER_QUIZ_PASS, newBadges };
    }

    await createNotification(
      req.userId,
      `You scored ${score}/${quiz.questions.length} on "${quiz.title}"`,
      `/learn/${quiz.course}`,
    );

    res
      .status(200)
      .json({ score, totalQuestions: quiz.questions.length, gamification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { createQuiz, getQuizForStudent, submitQuiz };
