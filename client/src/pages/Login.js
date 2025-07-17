import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../authContext';
import { FaUserCircle } from 'react-icons/fa';
import '../pages/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token } = await login(email, password);

      // Save to context and localStorage
      signIn(token);
      localStorage.setItem('token', token);

      // Decode token and normalize role
      const decoded = JSON.parse(atob(token.split('.')[1]));
      let role = decoded?.role || '';
      console.log('Decoded role from token:', role);

      // Normalize role (optional: replace hyphens with underscores)
      role = role.replace(/-/g, '_');

      // Navigate to role-specific route
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'supervisor_mahendergarh') {
        navigate('/supervisor_mahendergarh');
      } else if (role === 'supervisor_narnaul') {
        navigate('/supervisor_narnaul');
      } else if (role === 'supervisor_rewari') {
        navigate('/supervisor_rewari');
      } else if (role === 'supervisor') {
        navigate('/supervisor');
      } else {
        navigate('/login'); // fallback
      }

    } catch (err) {
      alert(err?.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="logo">
          <FaUserCircle className="text-[50px] text-white bg-purple-600 p-3 rounded-full shadow mb-4 items-center flex" />
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">Email:</label>
          <input
            type="email"
            className="login-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label">Password:</label>
          <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-demo">
          <p><strong>Demo Accounts:</strong></p>
          <p>
            admin@example.com / admin123 |<br />
            mahendergarh@district.com / Supervisor@123 |<br />
            supervisor.narnaul@district.com/SupervisorNarnaul@123 | rewari@district.com / rewari123
          </p>
        </div>
      </div>
    </div>
  );
}
