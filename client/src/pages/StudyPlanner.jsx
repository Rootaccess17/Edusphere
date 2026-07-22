import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import PomodoroTimer from "../components/PomodoroTimer";
import api from "../api/axios";

function StudyPlanner() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    date: "",
    time: "",
    durationMinutes: 25,
  });

  const fetchSessions = async () => {
    try {
      const response = await api.get("/study-sessions");
      setSessions(response.data);
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.date || !form.time) {
      toast.error("Title, date, and time are required");
      return;
    }

    try {
      await api.post("/study-sessions", form);
      toast.success("Study session added!");
      setForm({ title: "", subject: "", date: "", time: "", durationMinutes: 25 });
      fetchSessions();
    } catch (error) {
      toast.error("Failed to add session");
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await api.patch(`/study-sessions/${id}/toggle-complete`);
      setSessions((prev) => prev.map((s) => (s._id === id ? response.data : s)));
    } catch (error) {
      toast.error("Failed to update session");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/study-sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      toast.success("Session removed");
    } catch (error) {
      toast.error("Failed to delete session");
    }
  };

  // Group sessions by date for a clean list view
  const groupedByDate = sessions.reduce((groups, session) => {
    if (!groups[session.date]) groups[session.date] = [];
    groups[session.date].push(session);
    return groups;
  }, {});

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900">Study Planner</h1>
      <p className="text-gray-500 mt-1">Schedule sessions and stay focused with the Pomodoro timer.</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Add session + list */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What are you studying?"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 md:col-span-2"
            />
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject (optional)"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              name="durationMinutes"
              type="number"
              value={form.durationMinutes}
              onChange={handleChange}
              placeholder="Duration (minutes)"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors md:col-span-2"
            >
              Add Session
            </button>
          </form>

          {loading ? (
            <p className="text-sm text-gray-500">Loading sessions...</p>
          ) : Object.keys(groupedByDate).length === 0 ? (
            <p className="text-sm text-gray-500">
              No study sessions scheduled yet. Add one above to get started.
            </p>
          ) : (
            Object.keys(groupedByDate)
              .sort()
              .map((date) => (
                <div key={date} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {new Date(date + "T00:00:00").toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="space-y-2">
                    {groupedByDate[date].map((session) => (
                      <div
                        key={session._id}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                          session.completed
                            ? "bg-gray-50 border-gray-100"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={session.completed}
                            onChange={() => handleToggle(session._id)}
                          />
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                session.completed ? "text-gray-400 line-through" : "text-gray-900"
                              }`}
                            >
                              {session.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {session.time} · {session.durationMinutes} min
                              {session.subject ? ` · ${session.subject}` : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(session._id)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Right: Pomodoro timer */}
        <div>
          <PomodoroTimer />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudyPlanner;