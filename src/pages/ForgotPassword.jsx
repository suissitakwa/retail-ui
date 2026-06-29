import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/index";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
    } catch {
      // always show success to avoid user enumeration
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot password</h2>
        <p className="auth-subtext">Enter your email and we'll send you a reset link</p>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ color: "#22c55e", fontWeight: 500 }}>
              If that email is registered, a reset link is on its way.
            </p>
            <Link to="/login" style={{ color: "var(--color-primary)" }}>Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="add-btn"
              disabled={loading}
              style={{ width: "100%", marginTop: "20px", padding: "13px", borderRadius: "10px", fontSize: "15px" }}
            >
              {loading ? "Sending…" : "Send reset link →"}
            </button>

            <p className="auth-subtext" style={{ textAlign: "center", marginTop: "16px" }}>
              <Link to="/login">Back to sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
