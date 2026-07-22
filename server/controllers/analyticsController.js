const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Quiz = require("../models/Quiz");

// GET /api/analytics/instructor
async function getInstructorAnalytics(req, res) {
  try {
    const courses = await Course.find({ instructor: req.userId });
    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } });
    const payments = await Payment.find({ course: { $in: courseIds }, status: "paid" });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const perCourse = courses.map((course) => {
      const courseEnrollments = enrollments.filter(
        (e) => e.course.toString() === course._id.toString()
      );
      const courseRevenue = payments
        .filter((p) => p.course.toString() === course._id.toString())
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        courseId: course._id,
        title: course.title,
        students: courseEnrollments.length,
        revenue: courseRevenue,
      };
    });

    res.status(200).json({
      totalCourses: courses.length,
      totalStudents: enrollments.length,
      totalRevenue,
      perCourse,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/analytics/admin
async function getAdminAnalytics(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    const payments = await Payment.find({ status: "paid" });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Simple growth: users created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      newUsersThisWeek,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { getInstructorAnalytics, getAdminAnalytics };