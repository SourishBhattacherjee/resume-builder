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
            setPreview(response.data.previewImage);
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

  const nextStep = () => {
    debouncedNextStep();
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const generatePreview = async () => {
    try {
      setIsGeneratingPreview(true);
      const response = await axios.post(`/update/${actualResumeId}`, formData);
      setPreview(response.data.image);
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
          (formData.personalDetails && formData.personalDetails[0] && (formData.personalDetails[0].fullName || formData.personalDetails[0].name)) || '',
        email:
          (formData.personalDetails && formData.personalDetails[0] && formData.personalDetails[0].email) || '',
        // the AI helper expects a text field; send JSON string of resume so the model can reason over structure
        text: JSON.stringify(formData),
        // include locale if available
        locale: formData.locale || 'en',
      };

      let response;
      // Primary: try a proxied internal route. If your backend proxies /ai/recommend to the AI helper service, use that.
      try {
        response = await axios.post('/ai/recommend', payload, { timeout: 30000 });
      } catch (err) {
        // Fallback: try local dev AI helper (FastAPI) running on port 9000
        response = await axios.post('http://localhost:9000/recommend', payload, { timeout: 30000 });
      }

      if (response && response.data && Array.isArray(response.data.suggestions)) {
        setAiSuggestions(response.data.suggestions);
      } else {
        // tolerate different shapes
        const suggestions = response && response.data && (response.data.suggestions || response.data) || [];
        setAiSuggestions(Array.isArray(suggestions) ? suggestions : [String(suggestions)]);
      }
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
        setPreview(response.data.previewImage);
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
    <>
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto p-6">
      {/* Form Section */}
      <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-6">
        <div className="text-xl font-bold mb-6 text-center">Step {step + 1} of 6</div>
        {renderStep()}
      </div>
      
      {/* Preview & AI Section */}
      <div className="lg:w-1/2 space-y-4">
        <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
          <div>
            <div className="text-sm text-gray-500">Live Preview</div>
            <div className="text-lg font-semibold">Resume Preview</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generatePreview}
              disabled={isGeneratingPreview}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isGeneratingPreview ? 'Generating...' : 'Generate Preview'}
            </button>

            <button
              onClick={recommendChanges}
              disabled={aiLoading || isGeneratingPreview}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
              title="Get AI recommendations for improving this resume"
            >
              {aiLoading ? 'Analyzing...' : 'Recommend changes'}
            </button>
          </div>
        </div>

        <ResumePreview preview={preview} />

      </div>
    </div>

    {/* AI Suggestions Side Panel */}
    <div
      className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isAiPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
        className="absolute top-1/2 -left-10 w-10 h-16 bg-white border border-r-0 border-gray-200 rounded-l-lg shadow-md flex items-center justify-center -translate-y-1/2 hover:bg-gray-50 transition-colors z-50 text-gray-600 focus:outline-none"
        title="Toggle AI Suggestions"
      >
        {isAiPanelOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        )}
      </button>

      <div className="p-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path>
              <path d="M7.13 14h.01"></path>
              <path d="M16.87 14h.01"></path>
              <path d="M9.5 18c1.38.6 3.62.6 5 0"></path>
            </svg>
            AI Assistant
          </div>
          <div className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {aiSuggestions.length ? `${aiSuggestions.length} tips` : 'New'}
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
                <div key={idx} className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-start gap-3 shadow-sm">
                  <div className="text-green-600 mt-0.5 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {s}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!aiLoading && !aiError && aiSuggestions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-3 px-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="15" y2="13"></line>
                <line x1="9" y1="17" x2="15" y2="17"></line>
              </svg>
              <span className="text-sm">Click "Recommend changes" to get smart suggestions for your resume.</span>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Form;
