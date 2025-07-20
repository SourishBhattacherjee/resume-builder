import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOTP = ({ email, onVerified, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/verify-otp', { email, otp });
      toast.success('OTP verified successfully!');
      onVerified();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setCountdown(30);
    try {
      await axios.post('/send-otp', { email });
      toast.success('New OTP has been sent to your email');
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer position="top-center" autoClose={3000} />
      <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Verify OTP</h3>
      <p className="text-gray-600 mb-6 text-center">
        Sent to <span className="font-medium text-blue-600">{email}</span>
      </p>

      <div className="mb-6">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
          6-digit OTP
        </label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit code"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
          onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.length !== 6}
          className={`w-full px-4 py-2 rounded-md text-white transition duration-200 ${
            isLoading || otp.length !== 6 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify OTP'
          )}
        </button>

        <button
          onClick={handleResendOTP}
          disabled={isResending || countdown > 0}
          className={`w-full px-4 py-2 rounded-md transition duration-200 ${
            isResending || countdown > 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isResending ? (
            'Sending...'
          ) : countdown > 0 ? (
            `Resend OTP in ${countdown}s`
          ) : (
            'Resend OTP'
          )}
        </button>

        <button
          onClick={onCancel}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;