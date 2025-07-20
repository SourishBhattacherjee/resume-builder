import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = ({ email, onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/reset-password', { email, password });
      toast.success('Password reset successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
  <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
    Reset Password for <span className="text-blue-600">{email}</span>
  </h3>

  {/* Password Input */}
  <div className="mb-4">
    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
      New Password
    </label>
    <div className="relative">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition duration-150"
      >
        {/* Toggle Eye Icons */}
        {showPassword ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
    {password.length > 0 && password.length < 8 && (
      <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
    )}
  </div>

  {/* Confirm Password */}
  <div className="mb-6">
    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
      Confirm Password
    </label>
    <input
      id="confirmPassword"
      type={showPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirm new password"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      onKeyPress={(e) => e.key === 'Enter' && handleReset()}
    />
    {confirmPassword && password !== confirmPassword && (
      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
    )}
  </div>

  {/* Buttons */}
  <div className="flex justify-between space-x-4">
    <button
      onClick={onCancel}
      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      Cancel
    </button>
    <button
      onClick={handleReset}
      disabled={isLoading || !password || !confirmPassword || password !== confirmPassword || password.length < 8}
      className={`flex-1 px-4 py-2 rounded-md text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isLoading || !password || !confirmPassword || password !== confirmPassword || password.length < 8
          ? 'bg-blue-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Resetting...
        </span>
      ) : (
        'Reset Password'
      )}
    </button>
  </div>
</div>

  );
};

export default ResetPassword;