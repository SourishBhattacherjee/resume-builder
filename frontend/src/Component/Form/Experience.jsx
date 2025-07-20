import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Experience = ({ formData = { experience: [] }, setFormData, nextStep, prevStep }) => {
  const experiences = formData.experience || [];

  const handleChange = (index, e) => {
    const updated = [...experiences];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, experience: updated });
  };

  const handleDateChange = (index, field, date) => {
    const updated = [...experiences];
    updated[index][field] = date;
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
          startDate: null, 
          endDate: null, 
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
          
          {['companyName', 'location'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
              value={exp[field] || ''}
              onChange={(e) => handleChange(index, e)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            />
          ))}
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <DatePicker
                selected={exp.startDate ? new Date(exp.startDate) : null}
                onChange={(date) => handleDateChange(index, 'startDate', date)}
                selectsStart
                startDate={exp.startDate ? new Date(exp.startDate) : null}
                endDate={exp.currentlyWorking ? null : (exp.endDate ? new Date(exp.endDate) : null)}
                placeholderText="Select start date"
                className="w-full border border-gray-300 rounded-lg p-2"
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {exp.currentlyWorking ? 'End Date' : 'End Date (optional)'}
              </label>
              {exp.currentlyWorking ? (
                <div className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100">
                  Present
                </div>
              ) : (
                <DatePicker
                  selected={exp.endDate ? new Date(exp.endDate) : null}
                  onChange={(date) => handleDateChange(index, 'endDate', date)}
                  selectsEnd
                  startDate={exp.startDate ? new Date(exp.startDate) : null}
                  endDate={exp.endDate ? new Date(exp.endDate) : null}
                  minDate={exp.startDate ? new Date(exp.startDate) : null}
                  placeholderText="Select end date"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  isClearable
                />
              )}
            </div>
          </div>
          
          <label className="flex items-center space-x-2 mb-2">
            <input 
              type="checkbox" 
              checked={exp.currentlyWorking || false} 
              onChange={(e) => {
                const updated = [...experiences];
                updated[index].currentlyWorking = e.target.checked;
                if (e.target.checked) {
                  updated[index].endDate = null;
                }
                setFormData({ ...formData, experience: updated });
              }} 
            />
            <span>I currently work here</span>
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