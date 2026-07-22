import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function TakeQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [quizRes, enrollmentRes] = await Promise.all([
          api.get(`/quizzes/course/${courseId}`),
          api.get(`/enrollments/course/${courseId}`),
        ]);
        setQuiz(quizRes.data);
        setEnrollmentId(enrollmentRes.data._id);
      } catch (error) {
        toast.error(error.response?.data?.message || "No quiz available for this course");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      }));

      const response = await api.post(`/quizzes/${quiz._id}/submit`, {
        answers: formattedAnswers,
        enrollmentId,
      });

      setResult(response.data);

      const { gamification } = response.data;
      if (gamification?.xpGained) {
        toast.success(`+${gamification.xpGained} XP earned!`);
      }
      if (gamification?.newBadges?.length > 0) {
        gamification.newBadges.forEach((badge) => {
          toast.success(`🏆 New badge unlocked: ${badge.label}`);
        });
      }
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="pt-32 text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="pt-32 text-center text-gray-500">
          No quiz is available for this course yet.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 max-w-xl mx-auto text-center px-6">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Complete!</h1>
          <p className="mt-4 text-5xl font-bold text-gray-900">
            {result.score} / {result.totalQuestions}
          </p>
          <p className="text-gray-500 mt-2">
            You scored {Math.round((result.score / result.totalQuestions) * 100)}%
          </p>
          <button
            onClick={() => navigate(`/learn/${courseId}`)}
            className="mt-8 bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-28 pb-16 max-w-2xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>

        <div className="mt-8 space-y-6">
          {quiz.questions.map((question, index) => (
            <div
              key={question._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <p className="font-medium text-gray-900">
                {index + 1}. {question.questionText}
              </p>
              <div className="mt-4 space-y-2">
                {question.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                      answers[question._id] === oIndex
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question._id}
                      checked={answers[question._id] === oIndex}
                      onChange={() => selectAnswer(question._id, oIndex)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-8 bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}

export default TakeQuiz;