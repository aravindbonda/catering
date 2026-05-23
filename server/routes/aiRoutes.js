const express = require("express");
const router = express.Router();

const {
  generateAI,
} = require("../controllers/aiController");

/* ══════════════════════════════════════════════════════════════
   AI Routes
══════════════════════════════════════════════════════════════ */

router.post("/generate", generateAI);

module.exports = router;