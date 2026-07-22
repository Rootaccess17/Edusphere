const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String, // stored as "YYYY-MM-DD" for simple grouping/sorting
      required: true,
    },
    time: {
      type: String, // "HH:MM", 24-hour format
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 25,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudySession", studySessionSchema);