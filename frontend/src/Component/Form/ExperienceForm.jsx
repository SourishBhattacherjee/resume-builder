import React from 'react';

const ExperienceForm = ({ formData, setFormData, errors, setErrors, nextStep, prevStep }) => {
  const [experiences, setExperiences] = React.useState(formData.experiences || [
    { company: '', role: '', durationFrom: '', durationTo: '', points: ['', '', ''] }
  ]);

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperiences = [...experiences];
    updatedExperiences[index][name] = value;
    setExperiences(updatedExperiences);
    setFormData(prev => ({ ...prev, experiences: updatedExperiences }));
  };

  const handlePointChange = (expIndex, pointIndex, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[expIndex].points[pointIndex] = value;
    setExperiences(updatedExperiences);
    setFormData(prev => ({ ...prev, experiences: updatedExperiences }));
  };

  const addExperience = () => {
    setExperiences([...experiences, { company: '', role: '', durationFrom: '', durationTo: '', points: ['', '', ''] }]);
  };

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(updatedExperiences);
      setFormData(prev => ({ ...prev, experiences: updatedExperiences }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    experiences.forEach((exp, index) => {
      if (!exp.company) newErrors[`company-${index}`] = 'Company name is required';
      if (!exp.role) newErrors[`role-${index}`] = 'Role is required';
      if (!exp.durationFrom) newErrors[`durationFrom-${index}`] = 'Start date is required';
      
      // Validate at least one point is filled
      if (exp.points.every(point => !point.trim())) {
        newErrors[`points-${index}`] = 'At least one bullet point is required';
      }
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
      <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
      
      {experiences.map((experience, index) => (
        <div key={index} className="border p-4 rounded-lg relative">
          {experiences.length > 1 && (
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={experience.company}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                {errors[`company-${index}`] && <p className="text-red-500 text-sm">{errors[`company-${index}`]}</p>}
              </div>
              <div>
                <label className="block text-gray-700">Your Role *</label>
                <input
                  type="text"
                  name="role"
                  value={experience.role}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                {errors[`role-${index}`] && <p className="text-red-500 text-sm">{errors[`role-${index}`]}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">From *</label>
                <input
                  type="month"
                  name="durationFrom"
                  value={experience.durationFrom}
                  onChange={(e) => handleExperienceChange(index, e)}
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
                  value={experience.durationTo}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Key Responsibilities & Achievements *</label>
              {[0, 1, 2].map((pointIndex) => (
                <div key={pointIndex} className="flex items-center mb-2">
                  <span className="mr-2">•</span>
                  <input
                    type="text"
                    value={experience.points[pointIndex] || ''}
                    onChange={(e) => handlePointChange(index, pointIndex, e.target.value)}
                    className="flex-1 p-2 border-b rounded-none focus:border-blue-500 focus:outline-none"
                    placeholder={`Bullet point ${pointIndex + 1}`}
                  />
                </div>
              ))}
              {errors[`points-${index}`] && <p className="text-red-500 text-sm">{errors[`points-${index}`]}</p>}
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={addExperience}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          + Add Another Experience
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

export default ExperienceForm;