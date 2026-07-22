import { useEffect, useState } from "react";
import InstructorLayout from "../layouts/InstructorLayout";
import api from "../api/axios";

function InstructorRevenue() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/instructor").then((res) => setData(res.data));
  }, []);

  return (
    <InstructorLayout>
      <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
      <p className="text-3xl font-bold text-gray-900 mt-4">₹{data?.totalRevenue ?? 0}</p>

      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="p-4">Course</th>
              <th className="p-4">Students</th>
              <th className="p-4">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data?.perCourse?.map((c) => (
              <tr key={c.courseId} className="border-b border-gray-50 last:border-0">
                <td className="p-4">{c.title}</td>
                <td className="p-4">{c.students}</td>
                <td className="p-4">₹{c.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InstructorLayout>
  );
}

export default InstructorRevenue;