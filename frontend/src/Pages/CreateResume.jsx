import { useState } from 'react';
import axios from 'axios';

const CreateResume = () => {
  const [resumeName, setResumeName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeName || !selectedTemplate) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Get token from storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Fetch user ID first
      const userRes = await axios.get('/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!userRes.data.user?.userId) {
        throw new Error('User ID not found');
      }

      const userId = userRes.data.user.userId;

      // Create resume with user ID
      const response = await axios.post(`/create/${userId}`, {
        name: resumeName,
        template: selectedTemplate,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Resume created:', response.data);
      setSuccess(true);
      // Reset form
      setResumeName('');
      setSelectedTemplate('');
    } catch (err) {
      console.error('Error creating resume:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10">
        <div className="glass-card p-8 sm:p-10 border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          {/* subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-500/20 transform rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create New Resume</h2>
            <p className="text-slate-500 mt-2 font-medium">Choose a name and an ATS-optimized template</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Resume created successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="resumeName" className="block text-sm font-semibold text-slate-700 mb-2">
                Resume Name
              </label>
              <input
                type="text"
                id="resumeName"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
                placeholder="e.g., Senior Developer Application"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Select Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['template1', 'template2', 'template3','template4'].map((template) => (
                  <div key={template} className="relative">
                    <input
                      type="radio"
                      id={template}
                      name="template"
                      value={template}
                      checked={selectedTemplate === template}
                      onChange={() => setSelectedTemplate(template)}
                      className="peer sr-only"
                    />
                    <label 
                      htmlFor={template} 
                      className="flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out border-slate-200 bg-slate-50 hover:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:ring-1 peer-checked:ring-indigo-500"
                    >
                      <div className="w-full aspect-[8.5/11] bg-white rounded shadow-sm border border-slate-200 mb-2 overflow-hidden relative">
                         <img src={new URL(`../assets/${template}.png`, import.meta.url).href} alt={template} className="w-full h-full object-cover object-top opacity-80" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 capitalize">
                        {template.replace('template', 'Template ')}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !resumeName || !selectedTemplate}
              className={`w-full py-4 px-4 rounded-xl text-white font-bold text-lg ${
                isSubmitting || !resumeName || !selectedTemplate
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5'
              } transition-all duration-200 mt-4`}
            >
              {isSubmitting ? 'Creating...' : 'Create Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;