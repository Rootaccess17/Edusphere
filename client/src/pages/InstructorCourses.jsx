import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InstructorLayout from "../layouts/InstructorLayout";
import api from "../api/axios";

function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses/my-courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to load courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <InstructorLayout>
      <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
      <p className="text-gray-500 mt-1">Manage lessons and quizzes for each of your courses.</p>

      {loading ? (
        <p className="mt-8 text-sm text-gray-500">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">
          You haven't created any courses yet.{" "}
          <Link to="/instructor/create-course" className="underline">
            Create one now
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-36 object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{course.category}</p>

                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/instructor/courses/${course._id}/add-lesson`}
                    className="text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    + Add Lesson
                  </Link>
                  <Link
                    to={`/instructor/courses/${course._id}/add-quiz`}
                    className="text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    + Add Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </InstructorLayout>
  );
}

export default InstructorCourses;