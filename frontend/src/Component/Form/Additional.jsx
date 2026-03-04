import React from 'react';
import { useNavigate } from 'react-router-dom';

const Additional = ({ formData = { skills: [], languages: [] }, setFormData, prevStep, handleSubmit }) => {
  const navigate = useNavigate();
  
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

  const handleFinalSubmit = async () => {
    // Call the original handleSubmit if it exists
    if (handleSubmit) {
      await handleSubmit();
    }
    // Navigate to dashboard after submission
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800">Skills & Languages</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">Add skills and languages you are proficient in.</p>
      </div>
      
      {['skills', 'languages'].map((field) => (
        <div key={field} className="mb-8">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">
               {field}
             </h3>
             <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
               {(formData[field] || []).length} added
             </span>
          </div>
          
          <div className="space-y-3 mb-4">
            {(formData[field] || []).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={item}
                  onChange={(e) => handleListChange(field, index, e.target.value)}
                  placeholder={`e.g., ${field === 'skills' ? 'React.js' : 'Spanish (Fluent)'}`}
                  className="flex-1 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
                />
                <button
                  onClick={() => removeItem(field, index)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors shrink-0 border border-transparent hover:border-red-100"
                  title={`Remove ${field.slice(0, -1)}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => addItem(field)} 
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors w-max"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add {field.slice(0, -1).replace(/([A-Z])/g, ' $1').trim()}
          </button>
        </div>
      ))}
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200/60 mt-4">
        <button 
          onClick={prevStep} 
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button 
          onClick={handleFinalSubmit} 
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Finish & Save
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Additional;