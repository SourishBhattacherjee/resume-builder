import React from 'react';

const PersonalDetails = ({ formData, setFormData, nextStep, prevStep }) => {
  const personal = formData.personalDetails?.[0] || {};

  const handleChange = (e) => {
    const updated = { ...personal, [e.target.name]: e.target.value };
    setFormData({ ...formData, personalDetails: [updated] });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
      {['fullName', 'email', 'linkedin', 'github'].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={personal[field] || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
      ))}
      <div className="flex justify-between">
        <button onClick={prevStep} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Back</button>
        <button onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Next</button>
      </div>
    </div>
  );
};

export default PersonalDetails;