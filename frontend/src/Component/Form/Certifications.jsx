import React from 'react';

const Certifications = ({ formData, setFormData, nextStep, prevStep,handleSubmit}) => {
  const handleChange = (index, e) => {
    const updated = [...formData.certifications];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, certifications: updated });
  };

  const addCert = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: '', link: '' }]
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
      {formData.certifications?.map((cert, index) => (
        <div key={index} className="mb-4 border border-gray-200 p-4 rounded-lg">
          {['name', 'link'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={cert[field] || ''}
              onChange={(e) => handleChange(index, e)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            />
          ))}
        </div>
      ))}
      <button onClick={addCert} className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg">Add Certification</button>
      <div className="flex justify-between">
        <button onClick={prevStep} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Back</button>
        <button onClick={() => { nextStep(); handleSubmit(); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Next</button>
      </div>
    </div>
  );
};

export default Certifications;
