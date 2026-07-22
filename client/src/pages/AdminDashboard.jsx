import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../layouts/AdminLayout";
import api from "../api/axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    api
      .get("/analytics/admin")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
      <p className="text-gray-500 mt-1">Manage every user on EduSphere.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Users</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats?.totalUsers ?? users.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Courses</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats?.totalCourses ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">Total Revenue</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ₹{stats?.totalRevenue ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">New Users (7d)</span>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats?.newUsersThisWeek ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All Users</h2>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading users...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="p-4 text-gray-900 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-500 hover:text-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
