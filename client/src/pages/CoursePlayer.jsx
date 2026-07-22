import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import DiscussionThread from "../components/DiscussionThread";
import api from "../api/axios";

function CoursePlayer() {
  const { id: courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [certificateId, setCertificateId] = useState(null);

  const checkCertificateEligibility = async () => {
    try {
      const response = await api.get(`/certificates/eligibility/${courseId}`);
      setEligibility(response.data);
    } catch (error) {
      console.error("Failed to check certificate eligibility", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lessonsRes, enrollmentRes] = await Promise.all([
          api.get(`/lessons/course/${courseId}`),
          api.get(`/enrollments/course/${courseId}`),
        ]);

        setLessons(lessonsRes.data);
        setEnrollment(enrollmentRes.data);
        setActiveLesson(lessonsRes.data[0] || null);
        await checkCertificateEligibility();
      } catch (error) {
        toast.error("You need to enroll in this course first");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  const handleMarkComplete = async (lessonId) => {
    try {
      const response = await api.patch(`/enrollments/${enrollment._id}/complete-lesson`, {
        lessonId,
      });
      setEnrollment(response.data.enrollment);
      toast.success("Lesson marked as complete!");

      const { gamification } = response.data;
      if (gamification?.xpGained) {
        toast.success(`+${gamification.xpGained} XP earned!`);
      }
      if (gamification?.newBadges?.length > 0) {
        gamification.newBadges.forEach((badge) => {
          toast.success(`🏆 New badge unlocked: ${badge.label}`);
        });
      }

      checkCertificateEligibility();
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  const handleGetCertificate = async () => {
    setGenerating(true);
    try {
      const response = await api.post("/certificates/generate", { courseId });
      setCertificateId(response.data._id);
      toast.success("Certificate ready!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate certificate");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const token = localStorage.getItem("token");
    window.open(
      `http://localhost:5000/api/certificates/${certificateId}/download?token=${token}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="pt-32 text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="pt-32 text-center text-gray-500">
          You are not enrolled in this course yet.
        </p>
      </div>
    );
  }

  const isCompleted = (lessonId) => enrollment.completedLessons.includes(lessonId);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto flex gap-8 pb-8">
        {/* Video area */}
        <div className="flex-1">
          {activeLesson ? (
            <>
              <video
                key={activeLesson._id}
                src={activeLesson.videoUrl}
                controls
                className="w-full rounded-2xl bg-black"
              />
              <div className="mt-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">{activeLesson.title}</h1>
                <button
                  onClick={() => handleMarkComplete(activeLesson._id)}
                  disabled={isCompleted(activeLesson._id)}
                  className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-40"
                >
                  {isCompleted(activeLesson._id) ? "Completed ✓" : "Mark as Complete"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No lessons have been added to this course yet.</p>
          )}

          {/* Certificate section */}
          {eligibility?.eligible && (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">🎉 You've completed this course!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Generate your certificate of completion.
                </p>
              </div>

              {certificateId ? (
                <button
                  onClick={handleDownload}
                  className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Download PDF
                </button>
              ) : (
                <button
                  onClick={handleGetCertificate}
                  disabled={generating}
                  className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {generating ? "Generating..." : "Get Certificate"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lesson sidebar */}
        <div className="w-72 shrink-0">
          <h2 className="font-semibold text-gray-900 mb-3">Lessons</h2>
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <button
                key={lesson._id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-colors ${
                  activeLesson?._id === lesson._id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{lesson.title}</span>
                  {isCompleted(lesson._id) && <span>✓</span>}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <Link
              to={`/courses/${courseId}/quiz`}
              className="block text-center bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
            >
              Take Course Quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-6xl mx-auto pb-16">
        <DiscussionThread courseId={courseId} />
      </div>
    </div>
  );
}

export default CoursePlayer;