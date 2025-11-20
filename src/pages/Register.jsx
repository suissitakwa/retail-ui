import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { register as apiRegister, fetchProfile } from '../api';

export default function Register() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'ROLE_CUSTOMER',


  });

  const [error, setError] = useState('');
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRegister(form);
      const token = res.data.token;

      localStorage.setItem('accessToken', token);

      const profileRes = await fetchProfile();
      setAuthData(token, profileRes.data);

      navigate('/');
    } catch (err) {
      console.error('Registration failed', err);
      setError('Registration failed – try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create your Account</h2>
        <p className="auth-subtext">Join our shop and start ordering today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name Section */}
          <label>First Name</label>
          <input
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            required
          />

          {/* Contact */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* ADDRESS SECTION */}
          <h3 style={{ marginTop: "25px", color: "var(--color-secondary)" }}>
            Shipping Address
          </h3>

          <label>Street</label>
          <input
            type="text"
            name="street"
            value={form.street}
            onChange={handleChange}
            required
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />

          <label>State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />

          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            required
          />

          <label>Country</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          />

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full mt-4">
            Create Account
          </button>

          <p className="auth-subtext mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
