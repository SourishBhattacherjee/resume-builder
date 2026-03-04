import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import PersonalDetails from '../Component/Form/PersonalDetails';
import Education from '../Component/Form/Education';
import Experience from '../Component/Form/Experience';
import Projects from '../Component/Form/Projects';
import Certifications from '../Component/Form/Certifications';
import Additional from '../Component/Form/Additional';
import ResumePreview from '../Component/ResumePreview';

// Debounce utility to delay function execution
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Form = () => {
  const { resume_id, id } = useParams();
  const actualResumeId = resume_id || id;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    resumeName: '',
    personalDetails: [{}],
    education: [{}],
    experience: [{}],
    projects: [{}],
    certifications: [{}],
    skills: [],
    languages: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // New AI recommendation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (actualResumeId) {
          const response = await axios.get(`/resume/${actualResumeId}`);
          setFormData({
            ...response.data,
            personalDetails: response.data.personalDetails || [{}],
            education: response.data.education || [{}],
            experience: response.data.experience || [{}],
            projects: response.data.projects || [{}],
            certifications: response.data.certifications || [{}],
            skills: response.data.skills || [],
            languages: response.data.languages || [],
          });
          
          if (response.data.previewImage) {
            setPreview(response.data.pdfUrl);
          }
        }
      } catch (err) {
        setError(`Failed to load resume: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [actualResumeId]);

  // Debounced nextStep with 3-second buffer
  const debouncedNextStep = debounce(() => {
    setStep((prev) => prev + 1);
  }, 3000); // 3-second buffer

  const nextStep = async () => {
  try {
    setIsGeneratingPreview(true);

    const response = await axios.post(
      `/update/${actualResumeId}`,
      formData
    );

    setPreview(response.data.pdfUrl); // IMPORTANT
    setStep((prev) => prev + 1);

  } catch (err) {
    console.error("Error updating preview:", err);
    setError("Failed to generate preview");
  } finally {
    setIsGeneratingPreview(false);
  }
};

  const prevStep = () => setStep((prev) => prev - 1);

  const generatePreview = async () => {
    try {
      setIsGeneratingPreview(true);
      const response = await axios.post(`/update/${actualResumeId}`, formData);
      setPreview(response.data.pdfUrl);
    } catch (err) {
      console.error('Preview generation error:', err);
      setError('Failed to generate preview');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // New: call AI service to get recommendations based on resume JSON
const recommendChanges = async () => {
  setAiError(null);
  setAiSuggestions([]);
  try {
    setAiLoading(true);
    setIsAiPanelOpen(true);

    const payload = {
      full_name:
        (formData.personalDetails?.[0]?.fullName ||
          formData.personalDetails?.[0]?.name) ?? '',
      email: formData.personalDetails?.[0]?.email ?? '',
      text: JSON.stringify(formData),
      locale: formData.locale || 'en',
    };

    const response = await axios.post('/ai/recommend', payload, {
      timeout: 30000,
      responseType: 'text',
      transformResponse: (data) => data, // prevent axios from auto-parsing
    });

    const raw = typeof response.data === 'string'
      ? response.data
      : JSON.stringify(response.data);

    const suggestions = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 5);

    setAiSuggestions(suggestions.length > 0 ? suggestions : ['No suggestions returned.']);
  } catch (err) {
    console.error('AI recommendation error:', err);
    setAiError(err.response?.data?.message || err.message || 'AI request failed');
  } finally {
    setAiLoading(false);
  }
};

  const handleSubmit = async () => {
    try {
      let response;
      if (actualResumeId) {
        response = await axios.post(`/update/${actualResumeId}`, formData);
        setPreview(response.data.pdfUrl);
      } else {
        response = await axios.post('/resume', formData);
        navigate(`/form/${response.data._id}`);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(`Submission failed: ${err.message}`);
      alert('Failed to save resume. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <PersonalDetails formData={formData} setFormData={setFormData} nextStep={nextStep} handleSubmit={handleSubmit} />;
      case 1:
        return <Education formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} handleSubmit={handleSubmit} />;
      case 2:
        return <Experience formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} handleSubmit={handleSubmit} />;
      case 3:
        return <Projects formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} handleSubmit={handleSubmit} />;
      case 4:
        return <Certifications formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} handleSubmit={handleSubmit} />;
      case 5:
        return <Additional 
          formData={formData} 
          setFormData={setFormData} 
          prevStep={prevStep} 
          handleSubmit={handleSubmit} 
        />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">Loading resume data...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans relative pb-10 lg:pb-0">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto p-4 lg:p-6 lg:h-screen">
        
        {/* Form Section */}
        <div className="lg:w-1/2 flex flex-col glass-card bg-white/90 border border-slate-200/60 shadow-xl rounded-2xl overflow-hidden h-[75vh] lg:h-full shrink-0 lg:shrink">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="font-bold text-slate-800 flex items-center gap-2">
               <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">{step + 1}</span>
               <span className="inline text-slate-500 font-medium">/ 6 Steps</span>
            </div>
            <div className="w-full max-w-[150px] sm:max-w-xs bg-slate-200 h-2 rounded-full overflow-hidden ml-4">
               <div className="bg-indigo-600 h-full transition-all duration-500 ease-out" style={{width: `${((step + 1) / 6) * 100}%`}}></div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 overflow-y-auto flex-grow custom-scroll bg-white/50">
            {renderStep()}
          </div>
        </div>
        
        {/* Preview & AI Section */}
        <div className="lg:w-1/2 flex flex-col space-y-4 h-[80vh] lg:h-full shrink-0 lg:shrink mt-8 lg:mt-0">
          <div className="glass-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 border border-slate-200/60 shadow-lg rounded-2xl p-4 shrink-0 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Live Preview</div>
              <div className="text-lg font-bold text-slate-800">Your Resume</div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={generatePreview}
                disabled={isGeneratingPreview}
                className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isGeneratingPreview ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                )}
                <span className="hidden sm:inline">Refresh Preview</span>
              </button>

              <button
                onClick={recommendChanges}
                disabled={aiLoading || isGeneratingPreview}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/40 disabled:opacity-50 transition-all flex items-center gap-2"
                title="Get AI recommendations for improving this resume"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                <span className="hidden sm:inline">{aiLoading ? 'Analyzing...' : 'AI Enhance'}</span>
              </button>
            </div>
          </div>

          <div className="flex-grow glass-card bg-white/80 border border-slate-200/60 shadow-xl rounded-2xl overflow-hidden relative">
             <ResumePreview preview={preview} />
          </div>

        </div>
      </div>

    {/* AI Suggestions Side Panel */}
    <div
      className={`fixed top-0 right-0 h-full w-[calc(100%-3rem)] sm:w-96 bg-white/95 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-l border-slate-200/60 ${
        isAiPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
        className="absolute top-1/2 -left-12 w-12 h-20 bg-white/95 backdrop-blur border border-r-0 border-slate-200/60 rounded-l-2xl shadow-[-10px_0_20px_rgba(0,0,0,0.05)] flex items-center justify-center -translate-y-1/2 hover:bg-slate-50 transition-colors z-50 text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        title="Toggle AI Suggestions"
      >
        {isAiPanelOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        )}
      </button>

      <div className="p-6 h-full flex flex-col pt-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div className="text-xl font-black text-slate-800 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             </div>
            AI Assistant
          </div>
          <div className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full">
            {aiSuggestions.length ? `${aiSuggestions.length} Tips` : 'Standby'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
          {aiLoading && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 space-y-3">
              <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Analyzing your resume...</span>
            </div>
          )}

          {aiError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
              {aiError}
            </div>
          )}

          {!aiLoading && !aiError && aiSuggestions.length > 0 && (
            <div className="space-y-4">
              {aiSuggestions.map((s, idx) => (
                <div key={idx} className="bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-indigo-600 mt-0.5 shrink-0 bg-white p-1 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {s}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!aiLoading && !aiError && aiSuggestions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-4 px-4 text-center glass-panel rounded-2xl mx-2 border-dashed">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
               </div>
              <span className="text-sm font-medium">Click "AI Enhance" to get intelligent suggestions tailored to your resume.</span>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Form;
