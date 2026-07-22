const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  getAllUsers,
  deleteUser,
  getAllCourses,
  deleteCourse,
  getAllPayments,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", protect, requireRole("admin"), getAllUsers);
router.delete("/users/:id", protect, requireRole("admin"), deleteUser);
router.get("/courses", protect, requireRole("admin"), getAllCourses);
router.delete("/courses/:id", protect, requireRole("admin"), deleteCourse);
router.get("/payments", protect, requireRole("admin"), getAllPayments);

module.exports = router;