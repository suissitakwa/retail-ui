import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { register as apiRegister, fetchProfile } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    firstname: "", lastname: "", email: "", password: "",
    street: "", city: "", state: "", postalCode: "", country: "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const address = [form.street, form.city, form.state, form.postalCode, form.country]
      .filter(Boolean).join(", ");
    try {
      const res = await apiRegister({
        firstname: form.firstname, lastname: form.lastname,
        email: form.email, password: form.password,
        role: "ROLE_CUSTOMER", address,
      });
      const token = res.data.accessToken || res.data.token;
      localStorage.setItem("accessToken", token);
      const profileRes = await fetchProfile();
      setAuthData(token, profileRes.data);
      navigate("/");
    } catch (err) {
      const status = err?.response?.status;
      setError(
        status === 400
          ? "Registration failed. Check that your email is valid and password is at least 8 characters."
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <h2>Create your account</h2>
        <p className="auth-subtext">Join RetailShop and start ordering today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div>
              <label>First Name</label>
              <input type="text" name="firstname" value={form.firstname} onChange={handleChange} required placeholder="Takwa" />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" name="lastname"  value={form.lastname}  onChange={handleChange} required placeholder="Suissi" />
            </div>
          </div>

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="At least 8 characters" />

          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '24px', marginBottom: '0' }}>
            Shipping Address
          </p>

          <label>Street</label>
          <input type="text" name="street"     value={form.street}     onChange={handleChange} required placeholder="123 Main St" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div>
              <label>City</label>
              <input type="text" name="city"  value={form.city}  onChange={handleChange} required placeholder="New York" />
            </div>
            <div>
              <label>State</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} required placeholder="NY" />
            </div>
            <div>
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required placeholder="10001" />
            </div>
            <div>
              <label>Country</label>
              <input type="text" name="country" value={form.country} onChange={handleChange} required placeholder="USA" />
            </div>
          </div>

          <button
            type="submit"
            className="add-btn"
            disabled={loading}
            style={{ width: '100%', marginTop: '24px', padding: '13px', borderRadius: '10px', fontSize: '15px' }}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>

          <p className="auth-subtext" style={{ textAlign: 'center', marginTop: '16px' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
