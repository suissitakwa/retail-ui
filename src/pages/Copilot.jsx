import React, { useRef, useState } from 'react';
import { chatWithCopilot } from '../api';

const SUGGESTIONS = [
  'What is the status of my latest order?',
  'How much did I spend last month?',
  'Show me my most recent purchase.',
];

export default function Copilot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your AI shopping assistant. Ask me anything about your orders. You can also mention a specific Order ID if you want details about a particular order.",
    },
  ]);
  const [input, setInput]       = useState('');
  const [orderId, setOrderId]   = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const userMsg = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(scrollToBottom, 50);

    try {
      const res = await chatWithCopilot(userText, orderId ? Number(orderId) : null);
      const answer = res.data?.answer || 'Sorry, I could not get a response.';
      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="copilot-page">
      {/* HEADER */}
      <div className="copilot-header">
        <h2 className="copilot-title">
          <span>🤖</span> AI Shopping Assistant
        </h2>
        <p className="copilot-subtitle">
          Powered by GPT-4o-mini · Ask about your orders, spending, or products
        </p>
      </div>

      <div className="copilot-layout">
        {/* CHAT WINDOW */}
        <div className="copilot-chat-window">
          <div className="copilot-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`copilot-bubble-wrapper ${m.role === 'user' ? 'user' : 'assistant'}`}
              >
                {m.role === 'assistant' && (
                  <span className="copilot-avatar">🤖</span>
                )}
                <div className={`copilot-bubble ${m.role}`}>
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <span className="copilot-avatar user-avatar">👤</span>
                )}
              </div>
            ))}

            {loading && (
              <div className="copilot-bubble-wrapper assistant">
                <span className="copilot-avatar">🤖</span>
                <div className="copilot-bubble assistant copilot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="copilot-input-area">
            <input
              type="number"
              className="copilot-orderid-input"
              placeholder="Order ID (optional)"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              min="1"
            />
            <div className="copilot-input-row">
              <textarea
                className="copilot-textarea"
                rows={2}
                placeholder="Ask anything about your orders…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <button
                className="copilot-send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                aria-label="Send"
              >
                ➤
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR — suggestions */}
        <div className="copilot-sidebar">
          <h6 className="copilot-sidebar-title">💡 Suggestions</h6>
          <div className="copilot-suggestions">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="copilot-suggestion-btn"
                onClick={() => sendMessage(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="copilot-info-box">
            <p className="copilot-info-title">How it works</p>
            <ul className="copilot-info-list">
              <li>The assistant reads your real order data</li>
              <li>Provide an Order ID for specific details</li>
              <li>It never has access to your payment info</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
