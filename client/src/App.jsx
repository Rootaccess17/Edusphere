import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminOverview from "./pages/AdminOverview";
import AdminUsers from "./pages/AdminUsers";
import AdminCourses from "./pages/AdminCourses";
import AdminPayments from "./pages/AdminPayments";
import AdminAnalytics from "./pages/AdminAnalytics";
import CreateCourse from "./pages/CreateCourse";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import InstructorCourses from "./pages/InstructorCourses";
import AddLesson from "./pages/AddLesson";
import CoursePlayer from "./pages/CoursePlayer";
import AddQuiz from "./pages/AddQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import StudyPlanner from "./pages/StudyPlanner";
import MyCertificates from "./pages/MyCertificates";
import MyProgress from "./pages/MyProgress";
import InstructorStudents from "./pages/InstructorStudents";
import InstructorRevenue from "./pages/InstructorRevenue";
import InstructorAnalytics from "./pages/InstructorAnalytics";
import EduSphereAI from "./pages/EduSphereAI";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />

        {/* Student routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CoursePlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/quiz"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <TakeQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-planner"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudyPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyCertificates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <EduSphereAI />
            </ProtectedRoute>
          }
        />

        {/* Instructor routes */}
        <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/create-course"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses/:courseId/add-lesson"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <AddLesson />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses/:courseId/add-quiz"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <AddQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/students"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/revenue"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorRevenue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/analytics"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <InstructorAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;