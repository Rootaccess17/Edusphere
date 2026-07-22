import { useEffect, useState } from "react";
import InstructorLayout from "../layouts/InstructorLayout";
import api from "../api/axios";

function InstructorAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/instructor").then((res) => setData(res.data));
  }, []);

  return (
    <InstructorLayout>
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-500">Courses</span>
          <p className="text-3xl font-bold mt-2">{data?.totalCourses ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-500">Students</span>
          <p className="text-3xl font-bold mt-2">{data?.totalStudents ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-500">Revenue</span>
          <p className="text-3xl font-bold mt-2">₹{data?.totalRevenue ?? 0}</p>
        </div>
      </div>
    </InstructorLayout>
  );
}

export default InstructorAnalytics;