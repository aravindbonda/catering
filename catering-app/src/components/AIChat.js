import React, { useState } from "react";
import axios from "axios";

const AIChat = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  /* ══════════════════════════════════════════════════════════════
     Generate AI Response
  ══════════════════════════════════════════════════════════════ */

  const handleGenerate = async () => {
    try {
      if (!prompt.trim()) {
        alert("Please enter prompt");
        return;
      }

      setLoading(true);
      setResponse("");

      const res = await axios.post(
        "http://localhost:5000/api/ai/generate",
        {
          prompt,
        }
      );

      setResponse(res.data.response);

    } catch (error) {
      console.error("❌ AI Error:", error);

      alert(
        error?.response?.data?.message ||
        "Failed to generate AI response"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "28px",
        border: "1px solid #EADCCB",
        borderRadius: "24px",
        fontFamily: "Poppins, system-ui, sans-serif",
        background: "#ffffff",
        color: "#1F1F1F",
        boxShadow: "0 22px 60px rgba(73, 31, 20, 0.13)",
      }}
    >
      <h2>DeepSeek AI Integration</h2>

      {/* Prompt Input */}

      <textarea
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={8}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #EADCCB",
          resize: "none",
          fontSize: "16px",
          outlineColor: "#FC8019",
        }}
      />

      {/* Button */}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "12px 25px",
          backgroundColor: "#FC8019",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Generating..." : "Generate AI Response"}
      </button>

      {/* Response */}

      {response && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            backgroundColor: "#F5F1EC",
            borderRadius: "16px",
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>AI Response:</h3>

          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIChat;
