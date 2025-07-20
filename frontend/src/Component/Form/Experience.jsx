import React from 'react';

const Experience = ({ formData = { experience: [] }, setFormData, nextStep, prevStep }) => {
  // Ensure formData.experience exists or default to empty array
  const experiences = formData.experience || [];

  const handleChange = (index, e) => {
    const updated = [...experiences];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, experience: updated });
  };

  const handleResponsibilitiesChange = (index, respIndex, value) => {
    const updated = [...experiences];
    updated[index].responsibilities[respIndex] = value;
    setFormData({ ...formData, experience: updated });
  };

  const addResponsibility = (expIndex) => {
    const updated = [...experiences];
    updated[expIndex].responsibilities.push('');
    setFormData({ ...formData, experience: updated });
  };

  const removeResponsibility = (expIndex, respIndex) => {
    const updated = [...experiences];
    updated[expIndex].responsibilities.splice(respIndex, 1);
    setFormData({ ...formData, experience: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...experiences,
        { 
          companyName: '', 
          location: '', 
          startDate: '', 
          endDate: '', 
          currentlyWorking: false, 
          responsibilities: [''] 
        }
      ]
    });
  };

  const removeExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: updated });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Experience</h2>
      
      {experiences.map((exp, index) => (
        <div key={index} className="mb-6 border border-gray-200 p-4 rounded-lg relative">
          <button 
            onClick={() => removeExperience(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
          
          {['companyName', 'location', 'startDate', 'endDate'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
              value={exp[field] || ''}
              onChange={(e) => handleChange(index, e)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            />
          ))}
          
          <label className="flex items-center space-x-2 mb-2">
            <input 
              type="checkbox" 
              checked={exp.currentlyWorking || false} 
              onChange={(e) => {
                const updated = [...experiences];
                updated[index].currentlyWorking = e.target.checked;
                setFormData({ ...formData, experience: updated });
              }} 
            />
            <span>Currently Working</span>
          </label>
          
          <h3 className="font-medium mb-2">Responsibilities</h3>
          {exp.responsibilities?.map((res, respIndex) => (
            <div key={respIndex} className="flex items-center mb-2">
              <input
                value={res}
                onChange={(e) => handleResponsibilitiesChange(index, respIndex, e.target.value)}
                placeholder={`Responsibility ${respIndex + 1}`}
                className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
              />
              <button 
                onClick={() => removeResponsibility(index, respIndex)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => addResponsibility(index)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Responsibility
          </button>
        </div>
      ))}
      
      <button 
        onClick={addExperience} 
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Add Experience
      </button>
      
      <div className="flex justify-between">
        <button 
          onClick={prevStep} 
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
        <button 
          onClick={nextStep} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Experience;