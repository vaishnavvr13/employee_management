import React, { useState } from "react";
import { askGemini } from "../api";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setLoading(true);
    const aiReply = await askGemini(input);
    setMessages((msgs) => [...msgs, { sender: "ai", text: aiReply }]);
    setInput("");
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed",
      right: 32,
      bottom: 112,
      width: 320,
      maxHeight: 400,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      zIndex: 1001,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      border: "1px solid #eee"
    }}>
      <div style={{ padding: "12px 16px", background: "#003399", color: "#fff", fontWeight: "bold" }}>
       Chatbot
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.sender === "user" ? "right" : "left",
            marginBottom: 8
          }}>
            <span style={{
              display: "inline-block",
              background: msg.sender === "user" ? "#e0e7ff" : "#f4f7ff",
              color: "#222",
              borderRadius: 8,
              padding: "6px 12px",
              maxWidth: "80%"
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: "#888", fontStyle: "italic" }}>AI is typing...</div>}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #eee", padding: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={{ flex: 1, border: "none", outline: "none", padding: "8px", borderRadius: 8 }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ marginLeft: 8, background: "#003399", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
