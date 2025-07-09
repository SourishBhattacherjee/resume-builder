import React from 'react';

const EducationForm = ({ formData, setFormData, errors, setErrors, nextStep, prevStep }) => {
  const [educations, setEducations] = React.useState(formData.educations || [
    { school: '', durationFrom: '', durationTo: '', degree: '', coursework: '' }
  ]);

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducations = [...educations];
    updatedEducations[index][name] = value;
    setEducations(updatedEducations);
    setFormData(prev => ({ ...prev, educations: updatedEducations }));
  };

  const addEducation = () => {
    setEducations([...educations, { school: '', durationFrom: '', durationTo: '', degree: '', coursework: '' }]);
  };

  const removeEducation = (index) => {
    if (educations.length > 1) {
      const updatedEducations = educations.filter((_, i) => i !== index);
      setEducations(updatedEducations);
      setFormData(prev => ({ ...prev, educations: updatedEducations }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    educations.forEach((edu, index) => {
      if (!edu.school) newErrors[`school-${index}`] = 'School/University is required';
      if (!edu.degree) newErrors[`degree-${index}`] = 'Degree is required';
      if (!edu.durationFrom) newErrors[`durationFrom-${index}`] = 'Start date is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Education Details</h2>
      
      {educations.map((education, index) => (
        <div key={index} className="border p-4 rounded-lg relative">
          {educations.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">School/University Name *</label>
              <input
                type="text"
                name="school"
                value={education.school}
                onChange={(e) => handleEducationChange(index, e)}
                className="w-full p-3 border rounded-lg"
                required
              />
              {errors[`school-${index}`] && <p className="text-red-500 text-sm">{errors[`school-${index}`]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">From *</label>
                <input
                  type="month"
                  name="durationFrom"
                  value={education.durationFrom}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                {errors[`durationFrom-${index}`] && <p className="text-red-500 text-sm">{errors[`durationFrom-${index}`]}</p>}
              </div>
              <div>
                <label className="block text-gray-700">To</label>
                <input
                  type="month"
                  name="durationTo"
                  value={education.durationTo}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Degree Name * (e.g., BTech in CS)</label>
              <input
                type="text"
                name="degree"
                value={education.degree}
                onChange={(e) => handleEducationChange(index, e)}
                className="w-full p-3 border rounded-lg"
                required
              />
              {errors[`degree-${index}`] && <p className="text-red-500 text-sm">{errors[`degree-${index}`]}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Related Coursework</label>
              <textarea
                name="coursework"
                value={education.coursework}
                onChange={(e) => handleEducationChange(index, e)}
                className="w-full p-3 border rounded-lg"
                placeholder="Relevant courses, projects, etc."
                rows="3"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={addEducation}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          + Add Another Education
        </button>
        
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 ml-auto"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default EducationForm;