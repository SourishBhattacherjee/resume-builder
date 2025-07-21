import React from 'react';

const Projects = ({ formData = { projects: [] }, setFormData, nextStep, prevStep, handleSubmit }) => {
  // Ensure formData.projects exists or default to empty array
  const projects = formData.projects || [];

  const handleChange = (index, e) => {
    const updated = [...projects];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, projects: updated });
  };

  const handleDescChange = (index, descIndex, value) => {
    const updated = [...projects];
    updated[index].description[descIndex] = value;
    setFormData({ ...formData, projects: updated });
  };

  const addDescription = (projIndex) => {
    const updated = [...projects];
    updated[projIndex].description.push('');
    setFormData({ ...formData, projects: updated });
  };

  const removeDescription = (projIndex, descIndex) => {
    const updated = [...projects];
    updated[projIndex].description.splice(descIndex, 1);
    setFormData({ ...formData, projects: updated });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...projects,
        { 
          name: '', 
          link: '', 
          description: [''] 
        }
      ]
    });
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updated });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      
      {projects.map((proj, index) => (
        <div key={index} className="mb-6 border border-gray-200 p-4 rounded-lg relative">
          <button 
            onClick={() => removeProject(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
          
          {['name', 'link'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={proj[field] || ''}
              onChange={(e) => handleChange(index, e)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            />
          ))}
          
          <h3 className="font-medium mb-2">Description</h3>
          {proj.description?.map((desc, descIndex) => (
            <div key={descIndex} className="flex items-center mb-2">
              <input
                value={desc}
                onChange={(e) => handleDescChange(index, descIndex, e.target.value)}
                placeholder={`Description point ${descIndex + 1}`}
                className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
              />
              <button 
                onClick={() => removeDescription(index, descIndex)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          
          <button 
            onClick={() => addDescription(index)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Description Point
          </button>
        </div>
      ))}
      
      <button 
        onClick={addProject} 
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Add Project
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

export default Projects;