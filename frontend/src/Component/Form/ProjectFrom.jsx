import React, { useState } from 'react';

const ProjectForm = ({ formData, setFormData, errors, setErrors, nextStep, prevStep }) => {
  const [project, setProject] = useState({
    title: '',
    link: '',
    points: ['', '', '']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handlePointChange = (index, value) => {
    const newPoints = [...project.points];
    newPoints[index] = value;
    setProject(prev => ({ ...prev, points: newPoints }));
  };

  const addProject = () => {
    if (!project.title || !project.link || project.points.some(point => !point)) {
      setErrors({ ...errors, projects: 'Please fill all fields for the project' });
      return;
    }

    setFormData({
      ...formData,
      projects: [...(formData.projects || []), project]
    });
    setProject({
      title: '',
      link: '',
      points: ['', '', '']
    });
    setErrors({ ...errors, projects: '' });
  };

  const removeProject = (index) => {
    const updatedProjects = [...formData.projects];
    updatedProjects.splice(index, 1);
    setFormData({ ...formData, projects: updatedProjects });
  };

  const validateAndProceed = () => {
    if (formData.projects && formData.projects.length > 0) {
      nextStep();
    } else {
      setErrors({ ...errors, projects: 'Please add at least one project' });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Project Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Project Title</label>
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Project Link</label>
          <input
            type="url"
            name="link"
            value={project.link}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Project Points</label>
          {project.points.map((point, index) => (
            <input
              key={index}
              type="text"
              value={point}
              onChange={(e) => handlePointChange(index, e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder={`Point ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          type="button"
          onClick={addProject}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Project
        </button>
        
        {errors.projects && <p className="text-red-500">{errors.projects}</p>}
      </div>
      
      {/* Display added projects */}
      {formData.projects && formData.projects.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Added Projects</h3>
          <ul className="list-disc pl-5 space-y-2">
            {formData.projects.map((proj, index) => (
              <li key={index} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{proj.title}</span> - {proj.link}
                </div>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={validateAndProceed}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;