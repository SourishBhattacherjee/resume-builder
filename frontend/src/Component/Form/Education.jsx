import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Education = ({ formData, setFormData, nextStep, prevStep,handleSubmit}) => {
  const handleChange = (index, e) => {
    const updated = [...formData.education];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, education: updated });
  };

  const handleDateChange = (index, field, date) => {
    const updated = [...formData.education];
    updated[index][field] = date;
    setFormData({ ...formData, education: updated });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education, 
        { 
          institution: '', 
          degree: '', 
          startDate: null, 
          endDate: null, 
          relatedCoursework: '',
          currentlyStudying: false
        }
      ]
    });
  };

  const removeEducation = (index) => {
    const updated = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updated });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Education</h2>
      
      {formData.education?.map((edu, index) => (
        <div key={index} className="mb-6 border border-gray-200 p-4 rounded-lg relative">
          <button
            onClick={() => removeEducation(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
          
          {['institution', 'degree', 'relatedCoursework'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1')}
              value={edu[field] || ''}
              onChange={(e) => handleChange(index, e)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            />
          ))}
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <DatePicker
                selected={edu.startDate ? new Date(edu.startDate) : null}
                onChange={(date) => handleDateChange(index, 'startDate', date)}
                selectsStart
                startDate={edu.startDate ? new Date(edu.startDate) : null}
                endDate={edu.endDate ? new Date(edu.endDate) : null}
                placeholderText="Select start date"
                className="w-full border border-gray-300 rounded-lg p-2"
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              {edu.currentlyStudying ? (
                <div className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100">
                  Present
                </div>
              ) : (
                <DatePicker
                  selected={edu.endDate ? new Date(edu.endDate) : null}
                  onChange={(date) => handleDateChange(index, 'endDate', date)}
                  selectsEnd
                  startDate={edu.startDate ? new Date(edu.startDate) : null}
                  endDate={edu.endDate ? new Date(edu.endDate) : null}
                  minDate={edu.startDate ? new Date(edu.startDate) : null}
                  placeholderText="Select end date"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                />
              )}
            </div>
          </div>
          
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={edu.currentlyStudying || false}
              onChange={(e) => {
                const updated = [...formData.education];
                updated[index].currentlyStudying = e.target.checked;
                if (e.target.checked) {
                  updated[index].endDate = null;
                }
                setFormData({ ...formData, education: updated });
              }}
            />
            <span>I currently study here</span>
          </label>
        </div>
      ))}
      
      <button 
        onClick={addEducation} 
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Add Education
      </button>
      
      <div className="flex justify-between">
        <button 
          onClick={prevStep} 
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
        <button 
          onClick={() => { nextStep(); handleSubmit(); }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Education;