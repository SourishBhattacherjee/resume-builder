import React from 'react';

const PersonalDetails = ({ formData, setFormData, nextStep, prevStep, handleSubmit }) => {
  const personal = formData.personalDetails?.[0] || {};

  const handleChange = (e) => {
    const updated = { ...personal, [e.target.name]: e.target.value };
    setFormData({ ...formData, personalDetails: [updated] });
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800">Personal Details</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">Let's start with the basics.</p>
      </div>

      <div className="space-y-4 mb-8">
        {['fullName', 'email', 'linkedin', 'github'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-bold text-slate-700 mb-1 capitalize">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              name={field}
              placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
              value={personal[field] || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 pt-4 border-t border-slate-200/60">
        <button 
          onClick={prevStep} 
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button 
          onClick={() => { nextStep(); }} 
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Next Step
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;