const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  getEligibility,
  generateCertificate,
  downloadCertificate,
  getMyCertificates,
} = require("../controllers/certificateController");

const router = express.Router();

router.get("/eligibility/:courseId", protect, requireRole("student"), getEligibility);
router.post("/generate", protect, requireRole("student"), generateCertificate);
router.get("/:id/download", protect, requireRole("student"), downloadCertificate);
router.get("/my", protect, requireRole("student"), getMyCertificates);

module.exports = router;