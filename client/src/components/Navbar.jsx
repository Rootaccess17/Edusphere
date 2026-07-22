import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const dashboardPath =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "instructor"
        ? "/instructor-dashboard"
        : "/dashboard";

  const scrollToSection = (sectionId) => (e) => {
    e.preventDefault();

    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 300);
    } else {
      doScroll();
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/edusphere.png"
            alt="EduSphere"
            className="w-18 h-18 object-contain"
          />
          <span className="text-xl font-bold text-gray-900">EduSphere</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/courses" className="hover:text-gray-900 transition-colors">
            Courses
          </Link>
          <a
            href="#pricing"
            onClick={scrollToSection("pricing")}
            className="hover:text-gray-900 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#about"
            onClick={scrollToSection("about")}
            className="hover:text-gray-900 transition-colors"
          >
            About
          </a>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              {user?.role === "student" && <NotificationBell />}
              <Link
                to={dashboardPath}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
