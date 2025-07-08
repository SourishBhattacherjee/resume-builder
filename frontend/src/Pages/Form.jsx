import React, { useState } from 'react';
import axios from 'axios';
import ResumePreview from '../Component/ResumePreview';

const Form = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    linkedin: '',
    github: ''
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'linkedin':
        if (value && !/^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i.test(value)) {
          error = 'Please enter a valid LinkedIn URL';
        }
        break;
      case 'github':
        if (value && !/^(https?:\/\/)?(www\.)?github\.com\/.+/i.test(value)) {
          error = 'Please enter a valid GitHub URL';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:7000/generate-resume', formData);
      if (response.data.success) {
        setPreview(response.data.image);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to generate resume. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="lg:w-1/2 w-full bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Details</h2>
          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* LinkedIn */}
            <div className="mb-4">
              <label htmlFor="linkedin" className="block text-gray-700 mb-2">LinkedIn Profile</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://linkedin.com/in/your-profile"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.linkedin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
            </div>

            {/* GitHub */}
            <div className="mb-6">
              <label htmlFor="github" className="block text-gray-700 mb-2">GitHub Profile</label>
              <input
                type="url"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://github.com/your-username"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.github ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Resume'
              )}
            </button>

            {errors.submit && (
              <p className="text-red-500 text-sm mt-3 text-center">{errors.submit}</p>
            )}
          </form>
        </div>

        {/* Resume Preview */}
        <div className="lg:w-1/2 w-full">
          <ResumePreview preview={preview} />
        </div>
      </div>
    </div>
  );
};

export default Form;
