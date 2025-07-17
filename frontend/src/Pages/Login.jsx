import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import GetOTP from '../Component/GetOTP';
import VerifyOTP from '../Component/VerifyOTP';
import ResetPassword from '../Component/ResetPassoword';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [step, setStep] = useState('login'); // 'login', 'getOTP', 'verifyOTP', 'resetPassword'
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData);
      localStorage.setItem('token',response.data.token)
      toast.success(response.data.message);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      {step === 'login' && (
        <>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
            <button type="button" onClick={() => setStep('getOTP')}>
              Forgot Password?
            </button>
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? <a href="/register">Sign-Up</a>
          </p>
        </>
      )}

      {step === 'getOTP' && (
        <GetOTP
          onNext={(email) => {
            setUserEmail(email);
            setStep('verifyOTP');
          }}
          onCancel={() => setStep('login')}
        />
      )}

      {step === 'verifyOTP' && (
        <VerifyOTP
          email={userEmail}
          onVerified={() => setStep('resetPassword')}
          onCancel={() => setStep('login')}
        />
      )}

      {step === 'resetPassword' && (
        <ResetPassword
          email={userEmail}
          onSuccess={() => {
            toast.success('Password reset successful!');
            setStep('login');
          }}
          onCancel={() => setStep('login')}
        />
      )}
    </div>
  );
};

export default Login;
