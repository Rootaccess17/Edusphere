import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = async (query = "") => {
    setLoading(true);
    try {
      const response = await api.get(`/courses${query ? `?search=${query}` : ""}`);
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(search);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
        <p className="text-gray-500 mt-1">Find your next skill to master.</p>

        <form onSubmit={handleSearch} className="mt-6 max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full border border-gray-300 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </form>

        {loading ? (
          <p className="mt-10 text-sm text-gray-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="mt-10 text-sm text-gray-500">No courses found yet.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                to={`/courses/${course._id}`}
                key={course._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <span className="text-xs font-medium text-gray-400">{course.category}</span>
                  <h3 className="font-semibold text-gray-900 mt-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    By {course.instructor?.name || "Unknown"}
                  </p>
                  <p className="font-bold text-gray-900 mt-3">
                    {course.price === 0 ? "Free" : `₹${course.price}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCatalog;