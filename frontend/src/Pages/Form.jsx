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

        {/* AI Suggestions Panel */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">AI Recommendations</div>
            <div className="text-xs text-gray-500">{aiSuggestions.length ? `${aiSuggestions.length} suggestions` : 'No suggestions yet'}</div>
          </div>

          {aiLoading && (
            <div className="text-sm text-gray-600">Analyzing resume — this may take a few seconds...</div>
          )}

          {aiError && (
            <div className="text-sm text-red-500">Error: {aiError}</div>
          )}

          {!aiLoading && !aiError && aiSuggestions.length > 0 && (
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {aiSuggestions.map((s, idx) => (
                <li key={idx} className="text-gray-700">{s}</li>
              ))}
            </ul>
          )}

          {!aiLoading && !aiError && aiSuggestions.length === 0 && (
            <div className="text-sm text-gray-500">Click "Recommend changes" to get targeted suggestions from the AI helper.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
