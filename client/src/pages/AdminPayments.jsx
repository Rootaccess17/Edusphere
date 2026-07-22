import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../api/axios";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/payments").then((res) => setPayments(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading...</p>
      ) : payments.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No payments yet.</p>
      ) : (
        <table className="w-full text-sm mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="p-4">Student</th>
              <th className="p-4">Course</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b border-gray-50 last:border-0">
                <td className="p-4">{p.student?.name}</td>
                <td className="p-4">{p.course?.title}</td>
                <td className="p-4">₹{p.amount}</td>
                <td className="p-4 capitalize">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}

export default AdminPayments;