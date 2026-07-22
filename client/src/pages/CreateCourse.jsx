import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InstructorLayout from "../layouts/InstructorLayout";
import api from "../api/axios";

function CreateCourse() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("thumbnail", data.thumbnail[0]);

      await api.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course created successfully!");
      navigate("/instructor-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <InstructorLayout>
      <h1 className="text-2xl font-bold text-gray-900">Create a New Course</h1>
      <p className="text-gray-500 mt-1">Fill in the details below to publish your course.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Course Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="e.g. Complete Web Development Bootcamp"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Description
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={4}
            placeholder="What will students learn in this course?"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Category
            </label>
            <input
              {...register("category", { required: "Category is required" })}
              placeholder="e.g. Web Development"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Price (₹)
            </label>
            <input
              {...register("price", { required: "Price is required", min: 0 })}
              type="number"
              placeholder="0 for free"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Thumbnail Image
          </label>
          <input
            {...register("thumbnail", { required: "Thumbnail is required" })}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-600"
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-xs mt-1">{errors.thumbnail.message}</p>
          )}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-48 h-28 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Course"}
        </button>
      </form>
    </InstructorLayout>
  );
}

export default CreateCourse;