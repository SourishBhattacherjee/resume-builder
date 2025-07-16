import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GetOTP = ({ onNext, onCancel }) => {
  const [email, setEmail] = useState('');

  const handleSendOTP = async () => {
    try {
      await axios.post('/send-otp', { email });
      onNext(email);
      toast.success('OTP has been send to email')
    } catch (err) {
      toast.error('Email does not exist in DB');
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
