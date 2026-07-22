import { useEffect, useState } from "react";
import InstructorLayout from "../layouts/InstructorLayout";
import api from "../api/axios";

function InstructorDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/instructor").then((res) => setData(res.data)).catch(console.error);
  }, []);

  return (
    <InstructorLayout>
      <h1 className="text-2xl font-bold text-gray-900">Instructor Overview</h1>
      <p className="text-gray-500 mt-1">Your teaching performance at a glance.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Courses</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data?.totalCourses ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Students</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data?.totalStudents ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Revenue</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{data?.totalRevenue ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Per-Course Breakdown</h2>
        </div>
        {!data?.perCourse?.length ? (
          <p className="p-6 text-sm text-gray-500">No courses yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Students</th>
                <th className="p-4 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.perCourse.map((c) => (
                <tr key={c.courseId} className="border-b border-gray-50 last:border-0">
                  <td className="p-4 text-gray-900 font-medium">{c.title}</td>
                  <td className="p-4 text-gray-600">{c.students}</td>
                  <td className="p-4 text-gray-600">₹{c.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </InstructorLayout>
  );
}

export default InstructorDashboard;