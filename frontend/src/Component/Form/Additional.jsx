import React from 'react';

const Additional = ({ formData = { skills: [], languages: [] }, setFormData, prevStep, handleSubmit }) => {
  // Ensure arrays exist or default to empty arrays
  const skills = formData.skills || [];
  const languages = formData.languages || [];

  const handleListChange = (field, index, value) => {
    const updatedList = [...(formData[field] || [])];
    updatedList[index] = value;
    setFormData({ ...formData, [field]: updatedList });
  };

  const addItem = (field) => {
    setFormData({ 
      ...formData, 
      [field]: [...(formData[field] || []), ''] 
    });
  };

  const removeItem = (field, index) => {
    const updatedList = [...(formData[field] || [])];
    updatedList.splice(index, 1);
    setFormData({ ...formData, [field]: updatedList });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Skills & Languages</h2>
      
      {['skills', 'languages'].map((field) => (
        <div key={field} className="mb-8">
          <h3 className="text-xl font-medium mb-3">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </h3>
          
          {(formData[field] || []).map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                value={item}
                onChange={(e) => handleListChange(field, index, e.target.value)}
                placeholder={`${field.slice(0, -1)} ${index + 1}`}
                className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
              />
              <button
                onClick={() => removeItem(field, index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => addItem(field)} 
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Add {field.slice(0, -1)}
          </button>
        </div>
      ))}
      
      <div className="flex justify-between mt-8">
        <button 
          onClick={prevStep} 
          className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
        >
          Back
        </button>
        <button 
          onClick={handleSubmit} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Additional;