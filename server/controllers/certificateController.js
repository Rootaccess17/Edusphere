const PDFDocument = require("pdfkit");
const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const createNotification = require("../utils/notify");

const PASSING_PERCENTAGE = 50;

// Shared helper: figure out if a student has earned a certificate for a course
async function checkEligibility(studentId, courseId) {
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) {
    return { eligible: false, reason: "Not enrolled in this course" };
  }

  const totalLessons = await Lesson.countDocuments({ course: courseId });
  if (totalLessons === 0) {
    return { eligible: false, reason: "This course has no lessons yet" };
  }

  const allLessonsDone = enrollment.completedLessons.length >= totalLessons;
  if (!allLessonsDone) {
    return { eligible: false, reason: "Not all lessons are completed yet" };
  }

  const quiz = await Quiz.findOne({ course: courseId });
  if (quiz) {
    const attempts = enrollment.quizResults.filter(
      (r) => r.quiz.toString() === quiz._id.toString()
    );
    const bestAttempt = attempts.sort((a, b) => b.score - a.score)[0];

    if (!bestAttempt) {
      return { eligible: false, reason: "Quiz has not been attempted yet" };
    }

    const percentage = (bestAttempt.score / bestAttempt.totalQuestions) * 100;
    if (percentage < PASSING_PERCENTAGE) {
      return { eligible: false, reason: `Quiz score below ${PASSING_PERCENTAGE}% passing mark` };
    }
  }

  return { eligible: true };
}

// GET /api/certificates/eligibility/:courseId  (student)
async function getEligibility(req, res) {
  try {
    const result = await checkEligibility(req.userId, req.params.courseId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// POST /api/certificates/generate  (student)
async function generateCertificate(req, res) {
  try {
    const { courseId } = req.body;

    const existing = await Certificate.findOne({ student: req.userId, course: courseId });
    if (existing) {
      return res.status(200).json(existing);
    }

    const eligibility = await checkEligibility(req.userId, courseId);
    if (!eligibility.eligible) {
      return res.status(400).json({ message: eligibility.reason });
    }

    const certificate = await Certificate.create({ student: req.userId, course: courseId });

    const course = await Course.findById(courseId);
    await createNotification(
      req.userId,
      `Your certificate for "${course.title}" is ready to download!`,
      `/learn/${courseId}`
    );

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/certificates/:id/download  (student, must own it)
async function downloadCertificate(req, res) {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (certificate.student.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const student = await User.findById(certificate.student);
    const course = await Course.findById(certificate.course);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="EduSphere-Certificate-${course.title.replace(/\s+/g, "-")}.pdf"`
    );

    const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 0 });
    doc.pipe(res);

    // Background border
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .stroke("#111827");

    doc
      .fontSize(12)
      .fillColor("#9CA3AF")
      .text("EDUSPHERE", 0, 70, { align: "center" });

    doc
      .fontSize(36)
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .text("Certificate of Completion", 0, 100, { align: "center" });

    doc
      .fontSize(14)
      .fillColor("#6B7280")
      .font("Helvetica")
      .text("This certificate is proudly presented to", 0, 170, { align: "center" });

    doc
      .fontSize(30)
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .text(student.name, 0, 200, { align: "center" });

    doc
      .fontSize(14)
      .fillColor("#6B7280")
      .font("Helvetica")
      .text("for successfully completing the course", 0, 250, { align: "center" });

    doc
      .fontSize(20)
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .text(course.title, 0, 275, { align: "center" });

    doc
      .fontSize(11)
      .fillColor("#9CA3AF")
      .font("Helvetica")
      .text(
        `Issued on ${new Date(certificate.createdAt).toLocaleDateString()}   •   Certificate Code: ${certificate.certificateCode}`,
        0,
        340,
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/certificates/my  (student — list all their certificates)
async function getMyCertificates(req, res) {
  try {
    const certificates = await Certificate.find({ student: req.userId })
      .populate("course", "title thumbnail")
      .sort({ createdAt: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { getEligibility, generateCertificate, downloadCertificate, getMyCertificates };