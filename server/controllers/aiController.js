const { askAI, isAIEnabled } = require("../utils/aiClient");

// GET /api/ai/status
function getStatus(req, res) {
  res.status(200).json({ enabled: isAIEnabled });
}

// POST /api/ai/explain
async function explainConcept(req, res) {
  const { concept } = req.body;
  if (!concept) return res.status(400).json({ message: "Concept is required" });

  const answer = await askAI(
    `Explain this concept simply, in under 150 words, for a student: ${concept}`
  );
  res.status(200).json({ answer });
}

// POST /api/ai/quiz
async function generateQuiz(req, res) {
  const { topic, count } = req.body;
  if (!topic) return res.status(400).json({ message: "Topic is required" });

  const answer = await askAI(
    `Create ${count || 3} multiple-choice questions about "${topic}". For each: give the question, 4 options labeled A-D, and state the correct option letter. Format clearly with plain text, no markdown.`
  );
  res.status(200).json({ answer });
}

// POST /api/ai/study-plan
async function generateStudyPlan(req, res) {
  const { goal, days } = req.body;
  if (!goal) return res.status(400).json({ message: "Goal is required" });

  const answer = await askAI(
    `Create a simple day-by-day study plan for ${days || 7} days to learn: ${goal}. Keep it short and practical.`
  );
  res.status(200).json({ answer });
}

// POST /api/ai/chat (Supports continuous context-aware conversations)
async function chat(req, res) {
  const { messages, message } = req.body;

  if (!messages && !message) {
    return res.status(400).json({ message: "Message or conversation history is required" });
  }

  // Pass conversation array if provided, otherwise single message
  const inputPayload = Array.isArray(messages) ? messages : message;

  const answer = await askAI(inputPayload);
  res.status(200).json({ answer });
}

module.exports = { getStatus, explainConcept, generateQuiz, generateStudyPlan, chat };