const askDeepSeek = require("../services/deepseekService");

/* ══════════════════════════════════════════════════════════════
   POST /api/ai/generate
   Body: { prompt }
══════════════════════════════════════════════════════════════ */

const generateAI = async (req, res, next) => {
  try {
    console.log("📥 AI Payload:", req.body);

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required.",
      });
    }

    const result = await askDeepSeek(prompt);

    return res.status(200).json({
      success: true,
      response: result,
    });

  } catch (err) {
    console.error("❌ AI Error:", err.message);
    next(err);
  }
};

module.exports = {
  generateAI,
};