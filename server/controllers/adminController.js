const User = require("../models/User");
const Course = require("../models/Course");
const Payment = require("../models/Payment");

// GET /api/admin/users
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete an admin account" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/admin/courses
async function getAllCourses(req, res) {
  try {
    const courses = await Course.find().populate("instructor", "name email").sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// DELETE /api/admin/courses/:id
async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await course.deleteOne();
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/admin/payments
async function getAllPayments(req, res) {
  try {
    const payments = await Payment.find()
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { getAllUsers, deleteUser, getAllCourses, deleteCourse, getAllPayments };