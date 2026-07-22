const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length >= 2,
      message: "A question needs at least 2 options",
    },
  },
  correctOptionIndex: {
    type: Number,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "A quiz needs at least 1 question",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);