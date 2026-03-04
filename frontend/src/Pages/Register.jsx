import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/register', formData);
      toast.success(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Animated gradient blobs */}
      <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-green-500/20 blur-[100px] animate-float" style={{animationDuration: '14s'}}></div>
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-float" style={{animationDuration: '17s', animationDelay: '2s'}}></div>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-50"
      />
      
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-6 sm:p-10 border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
           {/* subtle top highlight */}
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-blue-500/20 transform -rotate-3">
               <span className="text-white font-black text-2xl">RB</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Join us and build your future</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder-slate-400 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder-slate-400 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 placeholder-slate-400 font-medium text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5 transition-all duration-200 mt-4"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-200/60 pt-6">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold underline decoration-2 decoration-indigo-200 underline-offset-4">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;