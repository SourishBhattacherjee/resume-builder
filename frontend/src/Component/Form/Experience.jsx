import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Experience = ({ formData = { experience: [] }, setFormData, nextStep, prevStep, handleSubmit }) => {
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
    <div className="max-w-xl mx-auto py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800">Experience</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">List your professional work history.</p>
      </div>
      
      {experiences.map((exp, index) => (
        <div key={index} className="mb-6 bg-white/60 border border-slate-200 p-5 rounded-2xl relative group hover:shadow-md transition-all duration-300">
          <button 
            onClick={() => removeExperience(index)}
            className="absolute -top-3 -right-3 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
            title="Remove Experience"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="space-y-4 mb-4">
            {['companyName', 'location'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-bold text-slate-700 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  name={field}
                  placeholder={`e.g., ${field === 'companyName' ? 'Tech Corp Inc.' : 'San Francisco, CA'}`}
                  value={exp[field] || ''}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
                />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
              <div className="relative">
                <DatePicker
                  selected={exp.startDate ? new Date(exp.startDate) : null}
                  onChange={(date) => handleDateChange(index, 'startDate', date)}
                  selectsStart
                  startDate={exp.startDate ? new Date(exp.startDate) : null}
                  endDate={exp.currentlyWorking ? null : (exp.endDate ? new Date(exp.endDate) : null)}
                  placeholderText="Select start date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {exp.currentlyWorking ? 'End Date' : 'End Date (optional)'}
              </label>
              {exp.currentlyWorking ? (
                <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-indigo-50/50 text-indigo-700 font-bold flex items-center h-[50px]">
                  Present
                </div>
              ) : (
                <div className="relative">
                  <DatePicker
                    selected={exp.endDate ? new Date(exp.endDate) : null}
                    onChange={(date) => handleDateChange(index, 'endDate', date)}
                    selectsEnd
                    startDate={exp.startDate ? new Date(exp.startDate) : null}
                    endDate={exp.endDate ? new Date(exp.endDate) : null}
                    minDate={exp.startDate ? new Date(exp.startDate) : null}
                    placeholderText="Select end date"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    isClearable
                  />
                </div>
              )}
            </div>
          </div>
          
          <label className="flex items-center space-x-3 cursor-pointer mt-2 bg-slate-50 border border-slate-200/60 p-3 rounded-xl w-max mb-6">
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
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-bold text-slate-700">I currently work here</span>
          </label>
          
          <div className="border-t border-slate-200/60 pt-4">
            <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Responsibilities</h3>
            <div className="space-y-3">
              {exp.responsibilities?.map((res, respIndex) => (
                <div key={respIndex} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <textarea
                    value={res}
                    onChange={(e) => handleResponsibilitiesChange(index, respIndex, e.target.value)}
                    placeholder={`Responsibility or achievement ${respIndex + 1}`}
                    className="flex-1 w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800 text-sm overflow-hidden min-h-[44px] resize-y"
                    rows={1}
                  />
                  <button 
                    onClick={() => removeResponsibility(index, respIndex)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"
                    title="Remove Responsibility"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => addResponsibility(index)}
              className="mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors w-max"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Bullet Point
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={addExperience} 
        className="mb-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 font-bold px-4 py-3 rounded-xl w-full flex items-center justify-center gap-2 transition-colors border-dashed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        Add Another Experience
      </button>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-200/60">
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

export default Experience;