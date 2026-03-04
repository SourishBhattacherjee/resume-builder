import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from '../Component/Profile';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
            `/get/${userRes.data.user.userId}?page=${page}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setResumes(resumesRes.data.data || []);
          setTotalPages(resumesRes.data.totalPages || 1);

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
  }, [navigate,page]);

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Background blobs for premium feel */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-300/10 blur-[100px] pointer-events-none"></div>

      <div className="p-6 max-w-7xl mx-auto relative z-10">
      <ToastContainer position="top-center" autoClose={3000} className="z-50" />
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 glass-panel rounded-2xl p-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.fullName || 'User'}</span>!
          </h1>
          <p className="text-slate-500 font-medium mt-1">Ready to update your professional profile?</p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate('/create-resume')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Resume
          </button>
          
          {/* Profile Avatar Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-12 h-12 rounded-full border-2 border-indigo-200 hover:border-indigo-500 transition-all duration-200 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-4 focus:ring-indigo-500/20 bg-indigo-50 shadow-md transform hover:scale-105"
            title="My Profile"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-indigo-600 font-bold text-lg">
                {getInitials(user?.fullName)}
              </span>
            )}
          </button>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Your Resumes 
            <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
              {resumes.length}
            </span>
          </h2>
        </div>

        {resumes.length === 0 ? (
          <div className="glass-card text-center py-20 px-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-600 text-lg mb-6 font-medium">You haven't created any resumes yet.</p>
            <button
              onClick={() => navigate('/create-resume')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Build Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="glass-card overflow-hidden group hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 border border-slate-200/60 bg-white/60"
              >
                {/* Decorative Top Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-800 truncate pr-2 group-hover:text-indigo-600 transition-colors">
                      {resume.name || 'Untitled Resume'}
                    </h3>
                  </div>

                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      {resume.template || 'Template N/A'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center text-sm text-slate-600 font-medium">
                      <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(resume.lastUpdated)}
                    </div>
                    <div className="flex items-center text-sm text-slate-600 font-medium">
                      <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {resume.experience?.length || 0} Experience Entries
                    </div>
                    <div className="flex items-center text-sm text-slate-600 font-medium">
                      <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {resume.education?.length || 0} Education Entries
                    </div>
                  </div>

                  {resume.skills && resume.skills.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Top Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {resume.skills.slice(0, 4).map((skill, i) => (
                          <span key={i} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                        {resume.skills.length > 4 && (
                          <span className="bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium px-2 py-1 rounded-md">
                            +{resume.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-slate-200/60 pt-4 mt-auto">
                    <button
                      onClick={() => navigate(`/form/${resume._id}`)}
                      className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-lg text-sm font-bold flex items-center transition-colors"
                      title="Edit Resume"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDownload(resume._id)}
                      className="text-white bg-slate-800 hover:bg-black p-2 rounded-lg text-sm font-bold flex items-center shadow-md transition-colors"
                      title="Download PDF"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-sm font-bold flex items-center transition-colors"
                      title="Delete Resume"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center mt-12 gap-3 glass-panel mx-auto w-max max-w-full px-6 py-3 rounded-[2rem]">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-white rounded-lg disabled:opacity-50 text-slate-700 font-bold hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
            >
              Previous
            </button>

            <span className="text-indigo-700 font-bold px-4">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-white rounded-lg disabled:opacity-50 text-slate-700 font-bold hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Profile Modal Overlay */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity"
          onClick={() => setIsProfileOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md relative z-50">
            <Profile 
              onClose={() => setIsProfileOpen(false)} 
              onUpdateUser={(updatedUser) => setUser({...user, ...updatedUser})} 
            />
          </div>
        </div>
      )}
    </div>
    </div>
    
  );
};

export default Dashboard;