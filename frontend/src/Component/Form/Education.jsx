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
    <div className="max-w-xl mx-auto py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-800">Education</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">Add your educational background.</p>
      </div>
      
      {formData.education?.map((edu, index) => (
        <div key={index} className="mb-6 bg-white/60 border border-slate-200 p-5 rounded-2xl relative group hover:shadow-md transition-all duration-300">
          <button
            onClick={() => removeEducation(index)}
            className="absolute -top-3 -right-3 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
            title="Remove Education"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <div className="space-y-4 mb-4">
            {['institution', 'degree', 'relatedCoursework'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-bold text-slate-700 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  name={field}
                  placeholder={`e.g., ${field === 'institution' ? 'Harvard University' : field === 'degree' ? 'B.S. Computer Science' : 'Algorithms, Data Structures'}`}
                  value={edu[field] || ''}
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
                  selected={edu.startDate ? new Date(edu.startDate) : null}
                  onChange={(date) => handleDateChange(index, 'startDate', date)}
                  selectsStart
                  startDate={edu.startDate ? new Date(edu.startDate) : null}
                  endDate={edu.endDate ? new Date(edu.endDate) : null}
                  placeholderText="Select start date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
              {edu.currentlyStudying ? (
                <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-indigo-50/50 text-indigo-700 font-bold flex items-center h-[50px]">
                  Present
                </div>
              ) : (
                <div className="relative">
                  <DatePicker
                    selected={edu.endDate ? new Date(edu.endDate) : null}
                    onChange={(date) => handleDateChange(index, 'endDate', date)}
                    selectsEnd
                    startDate={edu.startDate ? new Date(edu.startDate) : null}
                    endDate={edu.endDate ? new Date(edu.endDate) : null}
                    minDate={edu.startDate ? new Date(edu.startDate) : null}
                    placeholderText="Select end date"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium text-slate-800"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                  />
                </div>
              )}
            </div>
          </div>
          
          <label className="flex items-center space-x-3 cursor-pointer mt-2 bg-slate-50 border border-slate-200/60 p-3 rounded-xl w-max">
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
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-bold text-slate-700">I currently study here</span>
          </label>
        </div>
      ))}
      
      <button 
        onClick={addEducation} 
        className="mb-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 font-bold px-4 py-3 rounded-xl w-full flex items-center justify-center gap-2 transition-colors border-dashed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        Add Another Education
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

export default Education;