import React, { useState } from 'react';
import {axios} from 'axios'

const Form = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    linkedin: '',
    github: ''
  });

  const [errors, setErrors] = useState({
    email: false,
    linkedin: false,
    github: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      }));
    }
  };

  const validateUrl = (url, platform) => {
    if (!url) return false;
    const patterns = {
      linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i,
      github: /^(https?:\/\/)?(www\.)?github\.com\/.+/i
    };
    return !patterns[platform].test(url);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'linkedin') {
      setErrors(prev => ({
        ...prev,
        linkedin: validateUrl(value, 'linkedin')
      }));
    }
    if (name === 'github') {
      setErrors(prev => ({
        ...prev,
        github: validateUrl(value, 'github')
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Personal Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 mb-2">
            Full Name*
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="linkedin" className="block text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://linkedin.com/in/your-profile"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.linkedin ? 'border-red-500' : ''
            }`}
          />
          {errors.linkedin && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid LinkedIn URL</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="github" className="block text-gray-700 mb-2">
            GitHub Profile
          </label>
          <input
            type="url"
            id="github"
            name="github"
            value={formData.github}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://github.com/your-username"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.github ? 'border-red-500' : ''
            }`}
          />
          {errors.github && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid GitHub URL</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Save Details
        </button>
      </form>
    </div>
  );
};

export default Form;