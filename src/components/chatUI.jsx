import React, { useState } from "react";
import { Send } from "lucide-react";
import "./chat.css";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Halo! Ada yang bisa saya bantu?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // function kirim ke n8n
  async function sendToN8N(message) {
    const res = await fetch(
      "https://hunchback-turbofan-happier.ngrok-free.dev/webhook/f742d119-750a-4597-81c6-052a9cf397ec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    // FIX: handle response kosong biar gak error
    const text = await res.text();
    return text || "Tidak ada jawaban dari server";
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);

    try {
      const reply = await sendToN8N(userMessage.text);

      const botMessage = {
        role: "bot",
        text: reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("ERROR:", error);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Maaf, Server error 😢" },
      ]);
    }

    setIsTyping(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">Chat AI model Qwen 3</div>

        <div className="chat-body">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-row ${msg.role === "user" ? "right" : "left"}`}
            >
              <div className={`bubble ${msg.role}`}>{msg.text}</div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-row left">
              <div className="bubble bot typing">
                AI sedang mengetik
                <span className="dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}