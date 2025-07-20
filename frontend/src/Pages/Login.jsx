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
      localStorage.setItem('token', response.data.token);
      toast.success(response.data.message);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          {step === 'login' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Sign in to your account</p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('getOTP')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Sign Up
                  </a>
                </p>
              </div>
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
      </div>
    </div>
  );
};

export default Login;