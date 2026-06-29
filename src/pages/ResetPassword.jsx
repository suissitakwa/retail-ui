import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/index";

export default function ResetPassword() {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const token                   = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError("This link is invalid or has expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p className="auth-subtext" style={{ textAlign: "center" }}>
            Invalid reset link. <Link to="/forgot-password">Request a new one</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set new password</h2>
        <p className="auth-subtext">Choose a strong password for your account</p>

        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ color: "#22c55e", fontWeight: 500 }}>
              Password updated! Redirecting to sign in…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <label>New password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />

            <button
              type="submit"
              className="add-btn"
              disabled={loading}
              style={{ width: "100%", marginTop: "20px", padding: "13px", borderRadius: "10px", fontSize: "15px" }}
            >
              {loading ? "Updating…" : "Update password →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
