import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InstructorLayout from "../layouts/InstructorLayout";
import api from "../api/axios";

function AddLesson() {
  const { courseId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("title", data.title);
      formData.append("order", data.order);
      if (data.video && data.video.length > 0) {
        formData.append("video", data.video[0]);
      }

      await api.post("/lessons", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lesson added successfully!");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lesson");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InstructorLayout>
      <h1 className="text-2xl font-bold text-gray-900">Add a Lesson</h1>
      <p className="text-gray-500 mt-1">
        Upload a video lesson for this course.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Lesson Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="e.g. Introduction to React Hooks"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Order (e.g. 1, 2, 3...)
          </label>
          <input
            {...register("order", { required: "Order is required" })}
            type="number"
            placeholder="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.order && (
            <p className="text-red-500 text-xs mt-1">{errors.order.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Video File
          </label>
          <input
            {...register("video")}
            type="file"
            accept="video/*"
            className="w-full text-sm text-gray-600"
          />
          {errors.video && (
            <p className="text-red-500 text-xs mt-1">{errors.video.message}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Uploading may take a moment depending on file size.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {submitting ? "Uploading..." : "Add Lesson"}
        </button>
      </form>
    </InstructorLayout>
  );
}

export default AddLesson;
