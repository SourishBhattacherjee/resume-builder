import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GetOTP = ({ onNext, onCancel }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/send-otp', { email });
      onNext(email);
      toast.success('OTP has been sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email does not exist in our system');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
        <p className="text-gray-600 mt-2">Enter your email to receive OTP</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
            onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Back to Login
          </button>
          <button
            onClick={handleSendOTP}
            disabled={isLoading}
            className={`w-full text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send OTP'
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default GetOTP;