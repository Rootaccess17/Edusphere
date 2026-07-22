import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InstructorLayout from "../layouts/InstructorLayout";
import api from "../api/axios";

function AddQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", ""], correctOptionIndex: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", ""], correctOptionIndex: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/quizzes", { courseId, title, questions });
      toast.success("Quiz created successfully!");
      navigate("/instructor/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InstructorLayout>
      <h1 className="text-2xl font-bold text-gray-900">Add a Quiz</h1>
      <p className="text-gray-500 mt-1">Create multiple-choice questions for this course.</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Quiz Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Module 1 Knowledge Check"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                Question {qIndex + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              value={q.questionText}
              onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
              placeholder="Question text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            <div className="space-y-2">
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctOptionIndex === oIndex}
                    onChange={() => updateQuestion(qIndex, "correctOptionIndex", oIndex)}
                  />
                  <input
                    value={option}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                + Add option
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Select the radio button next to the correct answer.
            </p>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          + Add Question
        </button>

        <div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </form>
    </InstructorLayout>
  );
}

export default AddQuiz;