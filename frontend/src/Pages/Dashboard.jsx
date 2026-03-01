import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const userRes = await axios.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.data.user?.userId) {
          throw new Error('User ID not found');
        }

        setUser(userRes.data.user);

        try {
          const resumesRes = await axios.get(
            `/get/${userRes.data.user.userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setResumes(resumesRes.data.data || []);
        } catch (resumesError) {
          if (resumesError.response?.status === 404) {
            setResumes([]);
          } else {
            throw resumesError;
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || err.message);
        navigate('/login');
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
      await axios.delete(`/delete/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(resumes.filter((r) => r._id !== resumeId));
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  const handleDownload = async (resumeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      setDownloading(true);

      const response = await axios.get(`/download/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
        responseType: 'blob',
        timeout: 30000
      });

      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `resume_${resumeId}.pdf`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('Download error:', error);
      let errorMessage = 'Download failed';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Please login to download';
        } else if (error.response.status === 404) {
          errorMessage = 'Resume not found';
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out';
      }

      toast.error(errorMessage);
    } finally {
      setDownloading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.split(" ");
    return words.map((w) => w[0]).join("").toUpperCase();
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading your data...</div>;

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.fullName || 'User'}!
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate('/create-resume')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-colors h-10"
          >
            + Create New Resume
          </button>
          
          {/* Profile Avatar Button */}
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full border-2 border-indigo-200 hover:border-indigo-500 transition-colors flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-50 shadow-sm"
            title="My Profile"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-indigo-600 font-bold text-sm">
                {getInitials(user?.fullName)}
              </span>
            )}
          </button>
        </div>
      </div>
<section>
        <h2 className="text-2xl font-semibold mb-6">Your Resumes ({resumes.length})</h2>

        {resumes.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">You don't have any resumes yet.</p>
            <button
              onClick={() => navigate('/create-resume')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                      {resume.name || 'Untitled Resume'}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {resume.template || 'Template N/A'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created: {formatDate(resume.lastUpdated)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Experience: {resume.experience?.length || 0} positions
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Education: {resume.education?.length || 0} entries
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Top Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {resume.skills?.slice(0, 5).map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {resume.skills?.length > 5 && (
                        <span className="text-xs text-gray-500">+{resume.skills.length - 5} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <button
                      onClick={() => navigate(`/form/${resume._id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                    <button
                      onClick={() => handleDownload(resume._id)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
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