import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../api/axios";

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/analytics/admin").then((res) => setStats(res.data));
    api.get("/admin/courses").then((res) => setCourses(res.data));
    api.get("/admin/payments").then((res) => setPayments(res.data));
  }, []);

  const paidCount = payments.filter((p) => p.status === "paid").length;
  const failedCount = payments.filter((p) => p.status === "failed").length;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
      <p className="text-gray-500 mt-1">Deeper growth and performance metrics.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Revenue</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats?.totalRevenue ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Successful Payments</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">{paidCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Failed Payments</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">{failedCount}</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Courses by Enrollment Interest</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="p-4">Course</th>
              <th className="p-4">Instructor</th>
              <th className="p-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-b border-gray-50 last:border-0">
                <td className="p-4">{c.title}</td>
                <td className="p-4">{c.instructor?.name}</td>
                <td className="p-4">{c.price === 0 ? "Free" : `₹${c.price}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminAnalytics;