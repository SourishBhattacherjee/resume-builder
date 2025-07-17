import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage (or wherever you're storing it)
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:7000/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.fullName || 'User'}!</h1>
      <div className="dashboard-content">
        {/* Your dashboard content here */}
        <p>This is your personalized dashboard.</p>
      </div>
    </div>
  );
};

export default Dashboard;