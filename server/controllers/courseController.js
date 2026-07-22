const Course = require("../models/Course");

// POST /api/courses  (instructor only)
async function createCourse(req, res) {
  try {
    const { title, description, category, price } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      thumbnail: req.file.path, // Cloudinary URL
      instructor: req.userId,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
  res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/courses  (public — student catalog, with search)
async function getAllCourses(req, res) {
  try {
    const { search, category } = req.query;

    const filter = { published: true };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/courses/:id  (public — single course details)
async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/courses/my-courses  (instructor only — their own courses)
async function getMyCourses(req, res) {
  try {
    const courses = await Course.find({ instructor: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { createCourse, getAllCourses, getCourseById, getMyCourses };