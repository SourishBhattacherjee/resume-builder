import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

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


  const handleOTP = async () => {
    try {
      await axios.post('/send-otp', {email});
      toast.success('OTP has been re-sent to email');
    }
    catch(e){
      console.log(e);
    }
  }

  return (
    <div>
      <h3>Enter OTP sent to {email}</h3>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={handleVerify}>Verify OTP</button>
      <button onClick = {handleOTP}>Re-send OTP</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default VerifyOTP;
