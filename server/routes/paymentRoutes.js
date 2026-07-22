const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { createOrder, verifyPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", protect, requireRole("student"), createOrder);
router.post("/verify", protect, requireRole("student"), verifyPayment);

module.exports = router;