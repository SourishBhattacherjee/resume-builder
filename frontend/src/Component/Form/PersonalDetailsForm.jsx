import React from 'react';

const PersonalDetailsForm = ({ formData, setFormData, errors, setErrors, nextStep }) => {
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Enter a valid email';
        }
        break;
      case 'linkedin':
        if (value && !/^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i.test(value)) {
          error = 'Invalid LinkedIn URL';
        }
        break;
      case 'github':
        if (value && !/^(https?:\/\/)?(www\.)?github\.com\/.+/i.test(value)) {
          error = 'Invalid GitHub URL';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    ['fullName', 'email', 'linkedin', 'github'].forEach(name => {
      const value = formData[name] || '';
      const error = validateField(name, value);
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Full Name *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-gray-700">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-gray-700">LinkedIn</label>
        <input
          type="url"
          name="linkedin"
          placeholder="https://linkedin.com/in/..."
          value={formData.linkedin}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
        {errors.linkedin && <p className="text-red-500 text-sm">{errors.linkedin}</p>}
      </div>

      <div>
        <label className="block text-gray-700">GitHub</label>
        <input
          type="url"
          name="github"
          placeholder="https://github.com/..."
          value={formData.github}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
        {errors.github && <p className="text-red-500 text-sm">{errors.github}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Next
      </button>
    </form>
  );
};

export default PersonalDetailsForm;
