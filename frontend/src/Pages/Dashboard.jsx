import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const userRes = await axios.get('http://localhost:7000/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.data.user?.userId) {
          throw new Error('User ID not found');
        }

        setUser(userRes.data.user);

        const resumesRes = await axios.get(
          `http://localhost:7000/get/${userRes.data.user.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!resumesRes.data.success || !resumesRes.data.data) {
          throw new Error('Failed to fetch resumes');
        }

        setResumes(resumesRes.data.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || err.message);
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async (resumeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:7000/delete/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(resumes.filter((r) => r._id !== resumeId));
    } catch (err) {
      alert('Failed to delete resume');
    }
  };

  const handleDownload = async (resumeId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:7000/download/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Download failed');
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading your data...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.fullName || 'User'}!</h1>
        <button
          onClick={() => navigate('/create-resume')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Create New Resume
        </button>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Resumes ({resumes.length})</h2>

        {resumes.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">You don't have any resumes yet.</p>
            <button
              onClick={() => navigate('/create-resume')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {resume.name || 'Untitled Resume'}
                  </h3>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {resume.template || 'N/A'}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <p><strong>Last Updated:</strong> {formatDate(resume.lastUpdated)}</p>
                  <p><strong>Experience:</strong> {resume.experience?.length || 0} positions</p>
                  <p><strong>Education:</strong> {resume.education?.length || 0} entries</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {resume.skills?.slice(0, 5).map((skill, i) => (
                    <span key={i} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {resume.skills?.length > 5 && (
                    <span className="text-xs text-gray-500">+{resume.skills.length - 5} more</span>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => navigate(`/resume/${resume._id}/edit`)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDownload(resume._id)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
