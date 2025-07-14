import React, { useState } from 'react';
import axios from 'axios';

const GetOTP = ({ onNext, onCancel }) => {
  const [email, setEmail] = useState('');

  const handleSendOTP = async () => {
    try {
      await axios.post('/send-otp', { email });
      onNext(email);
    } catch (err) {
      alert('Failed to send OTP');
    }
  };

  return (
    <div>
      <h3>Enter your email</h3>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleSendOTP}>Send OTP</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default GetOTP;
