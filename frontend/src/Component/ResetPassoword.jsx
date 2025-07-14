import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = ({ email, onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');

  const handleReset = async () => {
    try {
      await axios.post('/reset-password', { email, password });
      onSuccess();
    } catch (err) {
      alert('Failed to reset password');
    }
  };

  return (
    <div>
      <h3>Reset Password for {email}</h3>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
      />
      <button onClick={handleReset}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default ResetPassword;
