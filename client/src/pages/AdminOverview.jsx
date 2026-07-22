import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../api/axios";

function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/analytics/admin").then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
      <p className="text-gray-500 mt-1">A snapshot of how EduSphere is doing.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Users</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Courses</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalCourses ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Revenue</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats?.totalRevenue ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">New Users (7d)</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.newUsersThisWeek ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Students</span>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.totalStudents ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Instructors</span>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.totalInstructors ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Enrollments</span>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats?.totalEnrollments ?? 0}</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOverview;