import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../layouts/AdminLayout";
import api from "../api/axios";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/admin/courses").then((res) => setCourses(res.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await api.delete(`/admin/courses/${id}`);
    toast.success("Course deleted");
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading...</p>
      ) : (
        <table className="w-full text-sm mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="p-4">Title</th>
              <th className="p-4">Instructor</th>
              <th className="p-4">Price</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-b border-gray-50 last:border-0">
                <td className="p-4">{c.title}</td>
                <td className="p-4">{c.instructor?.name}</td>
                <td className="p-4">{c.price === 0 ? "Free" : `₹${c.price}`}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}

export default AdminCourses;