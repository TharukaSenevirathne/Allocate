import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';  // <-- import icons

export default function Login() {
  const [formData, setFormData] = useState({
    reg_no: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (formData.reg_no === 'admin' && formData.password === 'admin123') {
      setMessage({ type: 'success', text: 'Admin login successful!' });
      setTimeout(() => navigate('/admin-dashboard'), 1000);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        reg_no: formData.reg_no,
        password: formData.password,
      });

      setMessage({ type: 'success', text: res.data.message });

      setTimeout(() => {
        if (res.data.userType === 'Admin') {
          navigate('/admin-dashboard');
        } else if (res.data.userType === 'Staff') {
          navigate('/staff-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Login failed' });
    }
  };

  return (
    <div className="login-login-container">
      <form className="login-login-form" onSubmit={handleLogin}>
        <h2 className="login-form-title">Login</h2>

        {message.text && (
          <div className={`login-message ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <div className="login-form-group">
          <input
            type="text"
            name="reg_no"
            placeholder=" "
            value={formData.reg_no}
            onChange={handleChange}
            required
          />
          <label>Registration Number</label>
        </div>

        <div className="login-form-group" style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}
