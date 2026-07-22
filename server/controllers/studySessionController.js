const StudySession = require("../models/StudySession");

// POST /api/study-sessions
async function createSession(req, res) {
  try {
    const { title, subject, date, time, durationMinutes } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ message: "Title, date, and time are required" });
    }

    const session = await StudySession.create({
      student: req.userId,
      title,
      subject,
      date,
      time,
      durationMinutes: durationMinutes || 25,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// GET /api/study-sessions
async function getMySessions(req, res) {
  try {
    const sessions = await StudySession.find({ student: req.userId }).sort({ date: 1, time: 1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// PATCH /api/study-sessions/:id/toggle-complete
async function toggleComplete(req, res) {
  try {
    const session = await StudySession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.student.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.completed = !session.completed;
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

// DELETE /api/study-sessions/:id
async function deleteSession(req, res) {
  try {
    const session = await StudySession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.student.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await session.deleteOne();
    res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}

module.exports = { createSession, getMySessions, toggleComplete, deleteSession };