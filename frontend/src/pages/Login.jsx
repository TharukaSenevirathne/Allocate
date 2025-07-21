import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    const navigate = useNavigate(); // ✅ use the hook


  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.username === 'admin' && formData.password === 'admin123') {
      alert('Login successful!');
      navigate('/admin-dashboard'); // Redirect to admin dashboard
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="form-title">Login</h2>

        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder=" "
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label>User Name</label>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>

        <span className="forgot-password">Forgot Password?</span>
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}
