import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to load course", error);
      }
    };
    fetchCourse();
  }, [id]);

  const handleFreeEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post("/enrollments", { courseId: id });
      toast.success("Enrolled successfully!");
      navigate(`/learn/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaidEnroll = async () => {
    setEnrolling(true);
    try {
      const orderRes = await api.post("/payments/create-order", { courseId: id });
      const { orderId, amount, currency, keyId, paymentRecordId, courseName } = orderRes.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "EduSphere",
        description: courseName,
        order_id: orderId,
        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentRecordId,
              courseId: id,
            });
            toast.success("Payment successful! You're enrolled.");
            navigate(`/learn/${id}`);
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#111827",
        },
        modal: {
          ondismiss: () => setEnrolling(false),
        },
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start payment");
      setEnrolling(false);
    }
  };

  const handleEnroll = () => {
    if (!token) {
      toast.error("Please log in as a student to enroll");
      navigate("/login");
      return;
    }

    if (user?.role !== "student") {
      toast.error("Only students can enroll in courses");
      return;
    }

    if (course.price > 0) {
      handlePaidEnroll();
    } else {
      handleFreeEnroll();
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="pt-32 text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover rounded-2xl"
        />

        <span className="text-sm font-medium text-gray-400 mt-6 block">
          {course.category}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-1">{course.title}</h1>
        <p className="text-gray-500 mt-2">
          Created by {course.instructor?.name || "Unknown instructor"}
        </p>

        <p className="mt-6 text-gray-700 leading-relaxed">{course.description}</p>

        <div className="mt-8 flex items-center justify-between bg-gray-50 rounded-2xl p-6">
          <span className="text-2xl font-bold text-gray-900">
            {course.price === 0 ? "Free" : `₹${course.price}`}
          </span>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {enrolling
              ? "Processing..."
              : course.price === 0
              ? "Enroll Now"
              : `Pay ₹${course.price} & Enroll`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;