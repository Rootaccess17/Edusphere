
# 🎓 EduSphere - A Learnig Platform

### **Learn Beyond Limits.**

*A Premium AI-Powered Learning Management System (LMS) built with the MERN Stack.*

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-blue)
![License](https://img.shields.io/badge/License-MIT-green)

### **🚀 Learn • Teach • Grow**

---

# 📖 About EduSphere

**EduSphere** is a modern, enterprise-grade **Learning Management System (LMS)** designed to deliver a seamless digital learning experience for **students, instructors, and administrators**. Built with the **MERN Stack**, EduSphere combines powerful course management, interactive learning tools, AI-powered assistance, analytics, and secure payment integration into a single scalable platform.

The platform is inspired by the simplicity of **Apple**, the elegance of **Linear**, the productivity of **Notion**, and the performance-first approach of **Vercel**, resulting in a clean, modern, and highly responsive user experience.

EduSphere is designed as a production-ready SaaS application rather than a tutorial project, following industry-standard software architecture, clean coding practices, and scalable development principles.

---

# 🎯 Project Vision

EduSphere aims to transform online education by providing an intelligent, interactive, and engaging platform where learners can develop skills, instructors can create impactful courses, and administrators can efficiently manage the entire ecosystem.

The goal is to create an educational platform that is secure, scalable, user-friendly, and capable of supporting thousands of concurrent users while maintaining excellent performance and maintainability.

---

# ✨ Key Highlights

* 🎓 Enterprise-grade Learning Management System
* 🤖 Modular AI Assistant (EduSphere AI)
* 👨‍🎓 Student, Instructor & Admin Portals
* 📚 Complete Course Management
* 🎥 Video-Based Learning
* 📝 Assignments & Interactive Quizzes
* 📜 Automatic Certificate Generation
* 💳 Secure Razorpay Payment Integration
* 📈 Learning Analytics & Progress Tracking
* 💬 Real-Time Chat & Discussions
* 📅 Study Planner & Productivity Tools
* 🏆 Gamification with XP, Streaks & Badges
* 📱 Fully Responsive Design
* 🌙 Modern & Premium User Interface

---

# 🏗️ System Architecture

```
                    Users
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼
 Student      Instructor      Administrator
      │             │             │
      └─────────────┼─────────────┘
                    ▼
         React + Redux Frontend
                    │
          Axios REST API Requests
                    │
                    ▼
       Node.js + Express.js Backend
                    │
     Authentication & Business Logic
                    │
        MongoDB Atlas + Cloudinary
                    │
         Razorpay • Nodemailer
```

---

# 👨‍🎓 Student Module

Students have access to a complete digital learning environment designed to make education engaging, interactive, and productive.

### Features

* Secure Registration & Login
* Browse Courses
* Search & Filter Courses
* Course Enrollment
* Wishlist
* Bookmarks
* Video Learning
* PDF Notes
* Timestamped Notes
* Assignments
* Interactive Quizzes
* Flashcards
* Study Planner
* Pomodoro Timer
* Learning Roadmap
* AI Study Assistant
* Progress Tracking
* Weekly Reports
* Certificates
* Analytics Dashboard

---

# 👨‍🏫 Instructor Module

Instructors can create, manage, and analyze their educational content from a dedicated dashboard.

### Features

* Instructor Dashboard
* Create Courses
* Edit Courses
* Upload Videos
* Upload PDFs
* Create Assignments
* Create Quizzes
* Manage Students
* View Revenue
* Course Analytics
* Certificate Management
* Student Performance Reports

---

# 👨‍💼 Admin Module

The Admin Dashboard provides complete control over the platform.

### Features

* User Management
* Instructor Approval
* Student Management
* Course Management
* Payment Management
* Platform Analytics
* Revenue Reports
* Certificate Verification
* Content Moderation
* Platform Settings

---

# 🤖 EduSphere AI

**EduSphere AI** is a modular AI assistant built to enhance learning without making the platform dependent on an AI provider.

The platform works perfectly without an AI API key. Once a Gemini API key is configured, EduSphere AI automatically enables advanced AI-powered capabilities.

### AI Capabilities

* Explain Concepts
* Summarize Lessons
* Generate Quizzes
* Create Flashcards
* Personalized Study Plans
* Coding Assistance
* Interview Preparation
* Learning Recommendations

---

# 🎮 Gamification

To improve learner engagement, EduSphere includes several motivational features.

* XP System
* Daily Streaks
* Achievement Badges
* Leaderboards
* Weekly Goals
* Study Challenges
* Learning Milestones

---

# 💳 Payment System

EduSphere integrates **Razorpay** to provide a secure and seamless payment experience.

Features include:

* Course Purchase
* Secure Checkout
* Payment Verification
* Transaction History
* Enrollment Automation

---

# 💬 Communication

EduSphere encourages collaboration through built-in communication tools.

* Real-Time Chat
* Course Discussions
* Student-Instructor Messaging
* Notifications
* Email Updates

---

# 🖥️ Client (Frontend)

The frontend is built using **React 19** and focuses on delivering a fast, accessible, and visually polished experience.

### Responsibilities

* Authentication
* Landing Pages
* Course Browsing
* Student Dashboard
* Instructor Dashboard
* Admin Dashboard
* Video Player
* Quiz Interface
* Certificate Viewer
* Payment UI
* AI Chat Interface
* Responsive Design
* State Management
* API Communication

### Frontend Technologies

* React 19
* Vite
* Tailwind CSS
* shadcn/ui
* React Router DOM
* Redux Toolkit
* Axios
* React Hook Form
* Framer Motion
* React Hot Toast

---

# ⚙️ Server (Backend)

The backend serves as the core of EduSphere by handling authentication, business logic, APIs, security, and data management.

### Responsibilities

* REST API Development
* Authentication
* Authorization
* Course Management
* Enrollment System
* Quiz Management
* Assignment APIs
* Certificate Generation
* Payment Processing
* Email Services
* File Uploads
* Cloud Storage
* Analytics
* AI Integration Layer
* Security & Validation

### Backend Technologies

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcrypt
* Multer
* Cloudinary
* Razorpay
* Nodemailer

---

# 🗄️ Database

MongoDB Atlas stores all application data in a scalable NoSQL database.

### Major Collections

* Users
* Students
* Instructors
* Admins
* Courses
* Modules
* Lessons
* Videos
* Assignments
* Quizzes
* Questions
* Certificates
* Payments
* Chats
* Notifications
* Progress
* Reviews

---

# 🔒 Authentication & Security

EduSphere prioritizes security by implementing modern authentication and authorization practices.

* Session-Based Authentication
* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes
* Role-Based Access Control
* Secure Cookies
* Input Validation
* Environment Variables
* API Security
* Error Handling

---

# 📁 Project Structure

```text
EduSphere/
│
├── client/
│   ├── src/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── layouts/
│   ├── pages/
│   ├── redux/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── App.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── app.js
│   └── server.js
│
├── README.md
└── package.json
```

---

# 🛠️ Technology Stack

| Category       | Technologies                                                  |
| -------------- | ------------------------------------------------------------- |
| Frontend       | React 19, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit, Axios |
| Backend        | Node.js, Express.js                                           |
| Database       | MongoDB Atlas, Mongoose                                       |
| Authentication | Session Authentication, JWT, bcrypt                           |
| Cloud Storage  | Cloudinary, Multer                                            |
| Payments       | Razorpay                                                      |
| Email          | Nodemailer                                                    |
| Animations     | Framer Motion                                                 |

---

# 🚀 Future Roadmap

* AI Voice Tutor
* Live Classes
* Collaborative Whiteboard
* Mobile Application
* Multi-Language Support
* Offline Learning
* PWA Support
* AI Career Guidance
* Placement Preparation
* Community Learning
* Advanced Analytics

---

# 🤝 Contributing

Contributions are always welcome. If you would like to improve EduSphere, feel free to fork the repository, create a feature branch, and submit a pull request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

## ⭐ If you found this project helpful, consider giving it a star.

### **EduSphere — Learn Beyond Limits.**

**Building the future of digital education, one lesson at a time.**

Made with ❤️ using the MERN Stack.

