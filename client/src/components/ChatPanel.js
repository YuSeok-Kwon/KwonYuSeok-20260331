import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../api";

const SUGGESTIONS = [
  "건조하고 주름이 고민이에요",
  "트러블 피부에 좋은 제품 추천해주세요",
  "미백에 효과적인 성분이 뭐가 있나요?",
  "5000원 이하 보습 크림 추천해주세요",
];

export default function ChatPanel({ productCode, embedded = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(
        newMessages.map((m) => ({ role: m.role, content: m.content })),
        productCode
      );
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.message },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "죄송합니다. 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // embedded 모드 (사이드바 또는 모달 내)
  if (embedded) {
    return (
      <div className="chat-embedded">
        {!productCode && (
          <div className="chat-sidebar-header">
            <h3>🧴 AI 뷰티 컨시어지</h3>
            <p>피부 고민을 말씀해주세요!</p>
          </div>
        )}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <p>{productCode ? "이 제품에 대해 궁금한 점을 물어보세요!" : "안녕하세요! 다이소 뷰티 AI 컨시어지입니다."}</p>
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="suggestion-btn"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              {msg.role === "assistant" && (
                <span className="chat-avatar">🧴</span>
              )}
              <div className="chat-bubble">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant">
              <span className="chat-avatar">🧴</span>
              <div className="chat-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="이 제품에 대해 질문하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()}>
            전송
          </button>
        </div>
      </div>
    );
  }

  // 플로팅 모드 (기본)
  return (
    <>
      {/* 토글 버튼 */}
      <button
        className={`chat-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* 채팅 패널 */}
      <div className={`chat-panel ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <h3>🧴 AI 뷰티 컨시어지</h3>
          <p>피부 고민을 말씀해주세요!</p>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <p>안녕하세요! 다이소 뷰티 AI 컨시어지입니다.</p>
              <p>피부 고민이나 원하는 제품 종류를 알려주세요.</p>
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="suggestion-btn"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              {msg.role === "assistant" && (
                <span className="chat-avatar">🧴</span>
              )}
              <div className="chat-bubble">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant">
              <span className="chat-avatar">🧴</span>
              <div className="chat-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="피부 고민을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()}>
            전송
          </button>
        </div>
      </div>
    </>
  );
}
