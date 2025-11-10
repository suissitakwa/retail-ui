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
  // 1. Retrieve the new setter function from context
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

      // Step 1: Save the token to local storage
      localStorage.setItem('accessToken', token);

      // Step 2: Fetch the full user profile using the new token
      const profileRes = await fetchProfile();

      // Step 3: Update the global state immediately using the refactored context function
      // This is the fix: it tells the application the user is now authenticated.
      setAuthData(token, profileRes.data);

      navigate('/');
    } catch (err) {
      console.error('Registration failed', err);
      setError('Registration failed – try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create an Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            name="firstname"
            className="form-control"
            value={form.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            value={form.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Register</button>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}