import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

const BADGE_LABELS = {
  first_lesson: { label: "First Steps", icon: "🎯" },
  five_lessons: { label: "Getting Serious", icon: "📘" },
  twenty_lessons: { label: "Dedicated Learner", icon: "🏅" },
  quiz_ace: { label: "Quiz Ace", icon: "🧠" },
  streak_3: { label: "3-Day Streak", icon: "🔥" },
  streak_7: { label: "7-Day Streak", icon: "🔥" },
  streak_30: { label: "30-Day Streak", icon: "🔥" },
};

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };

    const fetchEnrollments = async () => {
      try {
        const response = await api.get("/enrollments/my");
        setEnrollments(response.data);
      } catch (error) {
        console.error("Failed to load enrollments", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchProfile();
    fetchEnrollments();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user?.name || "Student"} 👋
      </h1>
      <p className="text-gray-500 mt-1">
        Here's what's happening with your learning today.
      </p>

      <Link
        to="/courses"
        className="inline-block mt-4 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
      >
        Browse Courses
      </Link>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total XP</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {profile?.xp ?? 0} ⚡
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Daily Streak</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {profile?.streak ?? 0} 🔥
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Badges Earned</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {profile?.badges?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900">Your Badges</h2>

        {!profile?.badges || profile.badges.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">
            No badges yet — complete lessons and quizzes to start earning them!
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {profile.badges.map((code) => {
              const badge = BADGE_LABELS[code] || { label: code, icon: "🏆" };
              return (
                <div
                  key={code}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2"
                >
                  <span>{badge.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{badge.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900">Your Courses</h2>

        {loadingCourses ? (
          <p className="text-sm text-gray-500 mt-2">Loading your courses...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">
            You haven't enrolled in any courses yet. Browse the catalog above to get started.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment) => (
              <Link
                key={enrollment._id}
                to={`/learn/${enrollment.course._id}`}
                className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={enrollment.course.thumbnail}
                  alt={enrollment.course.title}
                  className="w-full h-28 object-cover"
                />
                <div className="p-4">
                  <span className="text-xs font-medium text-gray-400">
                    {enrollment.course.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-sm mt-1">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {enrollment.completedLessons.length} lesson(s) completed
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {profile && (
        <p className="mt-6 text-xs text-gray-400">
          Logged in as: {profile.email}
        </p>
      )}
    </DashboardLayout>
  );
}

export default StudentDashboard;