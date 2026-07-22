const OpenAI = require("openai");

// Initialize Groq client using the official OpenAI SDK
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Helper flag to check if the AI feature is active
const isAIEnabled = Boolean(process.env.GROQ_API_KEY);

/**
 * Handles both continuous chat history (arrays) and single prompts (strings)
 */
async function askAI(promptOrMessages, systemInstruction = "You are EduSphere AI, an intelligent, helpful learning assistant.") {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn("[EduSphere AI]: GROQ_API_KEY missing in .env");
      return "EduSphere AI is currently in offline mode. Please add a GROQ_API_KEY in your server environment.";
    }

    let formattedMessages = [];

    if (Array.isArray(promptOrMessages)) {
      // Continuous multi-turn conversation: keep only the last 10 messages for token protection
      const trimmedHistory = promptOrMessages.slice(-10);
      formattedMessages = [
        { role: "system", content: systemInstruction },
        ...trimmedHistory,
      ];
    } else {
      // Single action prompt (e.g., explain concept, quiz generator)
      formattedMessages = [
        { role: "system", content: systemInstruction },
        { role: "user", content: String(promptOrMessages) },
      ];
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // 100% Free high-speed model on Groq
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("[EduSphere AI Error]:", error.message);

    if (error.status === 429) {
      return "EduSphere AI rate limit reached. Please wait a few seconds and try again.";
    }

    return "EduSphere AI encountered an issue processing your request.";
  }
}

module.exports = {
  askAI,
  isAIEnabled,
};