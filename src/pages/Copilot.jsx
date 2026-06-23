import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithCopilot, cancelOrder } from '../api';

const SUGGESTIONS = [
  'What is the status of my latest order?',
  'How much did I spend last month?',
  'Show me my most recent purchase.',
];

function ActionButtons({ actions, onAction, pendingCancel, onConfirmCancel, onAbortCancel }) {
  if (!actions || actions.length === 0) return null;
  return (
    <div className="copilot-actions">
      {actions.map((action, i) => {
        if (action.name === 'CANCEL_NOT_ALLOWED') {
          return (
            <span key={i} className="copilot-action-chip disabled">
              {action.outputSummary}
            </span>
          );
        }
        if (action.name === 'CANCEL_ORDER_CONFIRM') {
          const orderId = action.input?.orderId;
          if (pendingCancel === orderId) {
            return (
              <span key={i} className="copilot-action-confirm">
                <span className="copilot-action-confirm-label">Confirm cancellation?</span>
                <button className="copilot-action-btn danger" onClick={() => onConfirmCancel(orderId)}>
                  Yes, cancel
                </button>
                <button className="copilot-action-btn" onClick={onAbortCancel}>
                  Keep order
                </button>
              </span>
            );
          }
          return (
            <button key={i} className="copilot-action-btn danger" onClick={() => onAction(action)}>
              {action.outputSummary}
            </button>
          );
        }
        return (
          <button key={i} className="copilot-action-btn" onClick={() => onAction(action)}>
            {action.outputSummary}
          </button>
        );
      })}
    </div>
  );
}

export default function Copilot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your AI shopping assistant. Ask me anything about your orders. You can also mention a specific Order ID if you want details about a particular order.",
      actions: [],
    },
  ]);
  const [input, setInput]           = useState('');
  const [orderId, setOrderId]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [pendingCancel, setPending] = useState(null);
  const bottomRef                   = useRef(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const pushAssistant = (text, actions = []) =>
    setMessages(prev => [...prev, { role: 'assistant', text, actions }]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: userText, actions: [] }]);
    setInput('');
    setPending(null);
    setLoading(true);
    setTimeout(scrollToBottom, 50);

    try {
      const res = await chatWithCopilot(userText, orderId ? Number(orderId) : null);
      const answer  = res.data?.answer  || 'Sorry, I could not get a response.';
      const actions = Array.isArray(res.data?.actions) ? res.data.actions : [];
      pushAssistant(answer, actions);
    } catch {
      pushAssistant('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  const handleAction = (action) => {
    if (action.name === 'OPEN_ORDER_DETAILS' || action.name === 'CHECK_PAYMENTS') {
      navigate('/orders');
    } else if (action.name === 'CANCEL_ORDER_CONFIRM') {
      setPending(action.input?.orderId);
    }
  };

  const handleConfirmCancel = async (id) => {
    setPending(null);
    setLoading(true);
    try {
      await cancelOrder(id);
      pushAssistant(`Order #${id} has been cancelled successfully.`);
    } catch {
      pushAssistant(`Could not cancel order #${id}. It may have already been processed.`);
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
                <div className="copilot-bubble-with-actions">
                  <div className={`copilot-bubble ${m.role}`}>
                    {m.text}
                  </div>
                  {m.role === 'assistant' && (
                    <ActionButtons
                      actions={m.actions}
                      onAction={handleAction}
                      pendingCancel={pendingCancel}
                      onConfirmCancel={handleConfirmCancel}
                      onAbortCancel={() => setPending(null)}
                    />
                  )}
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
