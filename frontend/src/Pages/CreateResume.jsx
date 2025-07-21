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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Resume</h2>
            <p className="mt-2 text-gray-600">Choose a name and select a template</p>
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

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="resumeName" className="block text-sm font-medium text-gray-700 mb-2">
                Resume Name
              </label>
              <input
                type="text"
                id="resumeName"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe's Resume"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template
              </label>
              <div className="grid gap-2">
                {['template1', 'template2', 'template3','template4'].map((template) => (
                  <div key={template} className="flex items-center">
                    <input
                      type="radio"
                      id={template}
                      name="template"
                      value={template}
                      checked={selectedTemplate === template}
                      onChange={() => setSelectedTemplate(template)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={template} className="ml-2 block text-sm text-gray-700 capitalize">
                      {template.replace('template', 'Template ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !resumeName || !selectedTemplate}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isSubmitting || !resumeName || !selectedTemplate
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              } transition-colors duration-200`}
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