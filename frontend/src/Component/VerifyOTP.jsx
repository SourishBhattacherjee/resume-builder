import React, { useState } from 'react';
import axios from 'axios';

const VerifyOTP = ({ email, onVerified, onCancel }) => {
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      await axios.post('/verify-otp', { email, otp });
      onVerified();
    } catch (err) {
      alert('Invalid OTP');
    }
  };

  return (
    <div>
      <h3>Enter OTP sent to {email}</h3>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={handleVerify}>Verify OTP</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default VerifyOTP;
