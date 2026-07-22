import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

function InstructorSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-2">
        <img src="/edusphere.png" alt="EduSphere" className="w-18 h-18 object-contain" />
        <span className="text-xl font-bold text-gray-900">EduSphere</span>
      </div>
      <span className="text-xs font-medium text-gray-400 mb-8">
        Instructor Panel
      </span>

      <nav className="flex-1 space-y-1">
        <Link
          to="/instructor-dashboard"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <span>🏠</span> Overview
        </Link>
        <Link
          to="/instructor/create-course"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <span>➕</span> Create Course
        </Link>
        <Link
          to="/instructor/courses"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <span>📚</span> My Courses
        </Link>
        <Link
          to="/instructor/students"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <span>🎓</span> My Students
        </Link>
        <Link
          to="/instructor/revenue"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <span>💰</span> Revenue
        </Link>
        <Link
          to="/instructor/analytics"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <span>📊</span> Analytics
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto text-sm font-medium text-red-500 hover:text-red-600 text-left px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
      >
        Log Out
      </button>
    </aside>
  );
}

export default InstructorSidebar;