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
  const [step, setStep] = useState('login');
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Animated gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-float" style={{animationDuration: '12s'}}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px] animate-float" style={{animationDuration: '15s', animationDelay: '2s'}}></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/20 blur-[100px] animate-float" style={{animationDuration: '18s', animationDelay: '4s'}}></div>

      <ToastContainer position="top-center" autoClose={3000} className="z-50" />
      
      <div className="w-full max-w-md relative z-10">
        {/* The Glass Card */}
        <div className="glass-card p-6 sm:p-10 border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          {/* subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          {step === 'login' && (
            <>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-500/20 transform rotate-3">
                  <span className="text-white font-black text-2xl">RB</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 mt-2 font-medium">Log in to continue building your future</p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder-slate-400 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder-slate-400 font-medium text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setStep('getOTP')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5 transition-all duration-200 mt-2"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-8 text-center border-t border-slate-200/60 pt-6">
                <p className="text-slate-500 font-medium">
                  Don't have an account?{' '}
                  <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold underline decoration-2 decoration-indigo-200 underline-offset-4">
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