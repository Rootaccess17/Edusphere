import { useEffect, useState } from "react";
import InstructorLayout from "../layouts/InstructorLayout";
import api from "../api/axios";

function InstructorStudents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enrollments/instructor-students").then((res) => setRows(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <InstructorLayout>
      <h1 className="text-2xl font-bold text-gray-900">My Students</h1>

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No students enrolled yet.</p>
      ) : (
        <table className="w-full text-sm mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="p-4">Student</th>
              <th className="p-4">Course</th>
              <th className="p-4">Progress</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-b border-gray-50 last:border-0">
                <td className="p-4">{r.student?.name}</td>
                <td className="p-4">{r.course?.title}</td>
                <td className="p-4">{r.completedLessons.length} lessons done</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </InstructorLayout>
  );
}

export default InstructorStudents;