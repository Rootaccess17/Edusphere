const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getInstructorAnalytics, getAdminAnalytics } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/instructor", protect, requireRole("instructor"), getInstructorAnalytics);
router.get("/admin", protect, requireRole("admin"), getAdminAnalytics);

module.exports = router;