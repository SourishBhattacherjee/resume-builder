import React from 'react';

const Certifications = ({ formData, setFormData, nextStep, prevStep,handleSubmit}) => {
  const handleChange = (index, e) => {
    const updated = [...formData.certifications];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, certifications: updated });
  };

  const addCert = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: '', link: '' }]
    });
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800">Certifications</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">Add any certifications to boost your profile.</p>
      </div>
      
      {formData.certifications?.map((cert, index) => (
        <div key={index} className="mb-6 bg-white/60 border border-slate-200 p-5 rounded-2xl relative group hover:shadow-md transition-all duration-300">
          <div className="space-y-4">
            {['name', 'link'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-bold text-slate-700 mb-1 capitalize">
                  {field === 'link' ? 'Credential URL (Optional)' : 'Certification Name'}
                </label>
                <input
                  name={field}
                  placeholder={`e.g., ${field === 'name' ? 'AWS Certified Solutions Architect' : 'https://...'}`}
                  value={cert[field] || ''}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button 
        onClick={addCert} 
        className="mb-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 font-bold px-4 py-3 rounded-xl w-full flex items-center justify-center gap-2 transition-colors border-dashed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        Add Certification
      </button>
      
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 pt-4 border-t border-slate-200/60">
        <button 
          onClick={prevStep} 
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button 
          onClick={() => { nextStep(); handleSubmit(); }} 
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Next Step
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Certifications;
