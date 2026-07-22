import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Hero() {
  const { token, user } = useSelector((state) => state.auth);

  const startLearningPath = token
    ? user?.role === "instructor"
      ? "/instructor-dashboard"
      : user?.role === "admin"
      ? "/admin-dashboard"
      : "/dashboard"
    : "/signup";

  return (
    <section className="pt-40 pb-24 px-6 text-center max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight"
      >
        Learn Beyond Limits.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto"
      >
        EduSphere is a modern learning platform that helps students master
        skills faster with AI-powered guidance, structured courses, and
        real progress tracking.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex items-center justify-center gap-4"
      >
        <Link
          to={startLearningPath}
          className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Start Learning
        </Link>
        <Link
          to="/courses"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          Explore Courses
        </Link>
      </motion.div>
    </section>
  );
}

export default Hero;