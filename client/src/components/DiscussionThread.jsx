import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

function DiscussionThread({ courseId }) {
  const [discussions, setDiscussions] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchDiscussions = async () => {
    try {
      const response = await api.get(`/discussions/course/${courseId}`);
      setDiscussions(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  // Load on first render
  useEffect(() => {
  fetchDiscussions();
}, [courseId]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setPosting(true);
    try {
      await api.post("/discussions", { courseId, message: newMessage });
      setNewMessage("");
      toast.success("Posted!");
      fetchDiscussions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (discussionId) => {
    const message = replyText[discussionId];
    if (!message || !message.trim()) return;

    try {
      await api.post(`/discussions/${discussionId}/reply`, { message });
      setReplyText({ ...replyText, [discussionId]: "" });
      setReplyingTo(null);
      fetchDiscussions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reply");
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading discussions...</p>;
  }

  if (discussions === null) {
    return null; // access denied or failed to load — error toast already shown
  }

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-gray-900 mb-4">Discussion Forum</h2>

      <form onSubmit={handlePost} className="flex gap-2 mb-6">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question or share something..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          type="submit"
          disabled={posting}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Post
        </button>
      </form>

      {discussions.length === 0 ? (
        <p className="text-sm text-gray-500">
          No discussions yet. Be the first to post something!
        </p>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div
              key={discussion._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {discussion.author?.name || "Unknown"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">
                  {discussion.author?.role}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-2">{discussion.message}</p>

              {discussion.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                  {discussion.replies.map((reply) => (
                    <div key={reply._id}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900">
                          {reply.author?.name || "Unknown"}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">
                          {reply.author?.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === discussion._id ? (
                <div className="flex gap-2 mt-4">
                  <input
                    value={replyText[discussion._id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [discussion._id]: e.target.value })
                    }
                    placeholder="Write a reply..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <button
                    onClick={() => handleReply(discussion._id)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
                  >
                    Send
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(discussion._id)}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 mt-3"
                >
                  Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscussionThread;