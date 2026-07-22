import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

function EduSphereAI() {
  const { user } = useSelector((state) => state.auth);
  const [enabled, setEnabled] = useState(true);
  const [mode, setMode] = useState("chat");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    api.get("/ai/status").then((res) => setEnabled(res.data.enabled)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setAnswer("");
    try {
      let response;
      if (mode === "explain") {
        response = await api.post("/ai/explain", { concept: input });
      } else if (mode === "quiz") {
        response = await api.post("/ai/quiz", { topic: input });
      } else if (mode === "plan") {
        response = await api.post("/ai/study-plan", { goal: input });
      } else {
        response = await api.post("/ai/chat", { message: input });
      }
      setAnswer(response.data.answer);
    } catch (error) {
      toast.error("Failed to get a response");
    } finally {
      setLoading(false);
    }
  };

  const modes = [
    { key: "chat", label: "Ask Anything" },
    { key: "explain", label: "Explain Concept" },
    { key: "quiz", label: "Generate Quiz" },
    { key: "plan", label: "Study Plan" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900">EduSphere AI</h1>
      <p className="text-gray-500 mt-1">Your personal learning assistant.</p>

      {!enabled && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-xl p-4">
          EduSphere AI isn't fully set up yet — add a Gemini API key on the server to unlock real responses. You can still try the interface below.
        </div>
      )}

      <div className="mt-6 flex gap-2 flex-wrap">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
              mode === m.key
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2 max-w-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "explain"
              ? "e.g. Recursion"
              : mode === "quiz"
              ? "e.g. JavaScript closures"
              : mode === "plan"
              ? "e.g. Learn React in 7 days"
              : "Ask me anything..."
          }
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl whitespace-pre-wrap text-sm text-gray-700">
          {answer}
        </div>
      )}
    </DashboardLayout>
  );
}

export default EduSphereAI;