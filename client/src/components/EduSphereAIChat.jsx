import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, RotateCcw } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function EduSphereAIChat({ mode = "chat" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const textToSend = input.trim();
    if (!textToSend || loading) return;

    // 1. INSTANTLY CLEAR TEXT BAR
    setInput("");

    // 2. Add User Message to History State
    const userMsg = { role: "user", content: textToSend };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setLoading(true);

    try {
      let endpoint = "/ai/chat";
      let payload = { message: textToSend, history: updatedHistory.slice(-8) };

      if (mode === "explain") {
        endpoint = "/ai/explain";
        payload = { concept: textToSend };
      } else if (mode === "quiz") {
        endpoint = "/ai/quiz";
        payload = { topic: textToSend };
      } else if (mode === "plan") {
        endpoint = "/ai/study-plan";
        payload = { goal: textToSend };
      }

      const response = await api.post(endpoint, payload);

      const botMsg = {
        role: "assistant",
        content: response.data.answer || "EduSphere AI did not yield a response.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("Failed to get a response from EduSphere AI");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to EduSphere AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Reset chat memory
  const handleClearChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[550px] w-full max-w-2xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header with Clear Chat Button */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-xl text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">EduSphere AI</h3>
            <p className="text-xs text-gray-500">
              Active Mode: <span className="font-medium capitalize">{mode}</span>
            </p>
          </div>
        </div>

        {/* Clear Chat Button */}
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-300 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-700" />
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 my-20 text-sm">
            Ask EduSphere AI anything about your courses, concepts, or roadmap!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`p-2 rounded-xl text-xs flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gray-900 text-white rounded-tr-none shadow-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
            EduSphere AI is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-gray-200 flex gap-2"
      >
        <input
          type="text"
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
          autoComplete="off"
          className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all font-medium flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}