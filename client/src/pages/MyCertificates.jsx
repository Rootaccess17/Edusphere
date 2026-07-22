import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

function MyCertificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/certificates/my").then((res) => setCerts(res.data)).finally(() => setLoading(false));
  }, []);

  const download = (id) => {
    const token = localStorage.getItem("token");
    window.open(`http://localhost:5000/api/certificates/${id}/download?token=${token}`, "_blank");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
      <p className="text-gray-500 mt-1">
        Complete a course's lessons (and quiz, if any) to earn a certificate — visit the course player and look for the green banner.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading...</p>
      ) : certs.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No certificates yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{c.course?.title}</p>
                <p className="text-xs text-gray-400 mt-1">Code: {c.certificateCode}</p>
              </div>
              <button onClick={() => download(c._id)} className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full">
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyCertificates;