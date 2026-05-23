const OpenAI = require("openai");

/* ══════════════════════════════════════════════════════════════
   DeepSeek Client Configuration
══════════════════════════════════════════════════════════════ */

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

/* ══════════════════════════════════════════════════════════════
   Helper Function
══════════════════════════════════════════════════════════════ */

const askDeepSeek = async (prompt) => {
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",

      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ DeepSeek Error:", error.message);
    throw new Error("Failed to generate AI response");
  }
};

module.exports = askDeepSeek;