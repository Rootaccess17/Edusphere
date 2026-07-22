const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Payment = require("../models/Payment");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// POST /api/payments/create-order  (student)
async function createOrder(req, res) {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.price <= 0) {
      return res.status(400).json({ message: "This course is free, no payment needed" });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.userId,
      course: courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const order = await razorpay.orders.create({
      amount: course.price * 100, // Razorpay uses paise, not rupees
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const payment = await Payment.create({
      student: req.userId,
      course: courseId,
      amount: course.price,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentRecordId: payment._id,
      courseName: course.title,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// POST /api/payments/verify  (student)
async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentRecordId,
      courseId,
    } = req.body;

    // Recreate the expected signature using our secret key
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await Payment.findByIdAndUpdate(paymentRecordId, { status: "failed" });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    await Payment.findByIdAndUpdate(paymentRecordId, {
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
    });

    const enrollment = await Enrollment.create({
      student: req.userId,
      course: courseId,
      payment: paymentRecordId,
      completedLessons: [],
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { createOrder, verifyPayment };