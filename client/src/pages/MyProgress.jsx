import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

function MyProgress() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enrollments/my").then((res) => setEnrollments(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading...</p>
      ) : enrollments.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">Enroll in a course to start tracking progress.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {enrollments.map((e) => (
            <div key={e._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-semibold text-gray-900">{e.course?.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                {e.completedLessons.length} lessons completed · {e.quizResults.length} quiz attempt(s)
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyProgress;