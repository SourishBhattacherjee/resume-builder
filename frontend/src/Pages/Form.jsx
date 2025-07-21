import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import PersonalDetails from '../Component/Form/PersonalDetails';
import Education from '../Component/Form/Education';
import Experience from '../Component/Form/Experience';
import Projects from '../Component/Form/Projects';
import Certifications from '../Component/Form/Certifications';
import Additional from '../Component/Form/Additional';
import ResumePreview from '../Component/ResumePreview'; // Import the preview component

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
  const [preview, setPreview] = useState(null); // State for storing preview image
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false); // Loading state for preview

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
          
          // If there's a preview image in the response, set it
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

  const nextStep = () => setStep((prev) => prev + 1);
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

  const handleSubmit = async () => {
  try {
    let response;
    if (actualResumeId) {
      response = await axios.post(`/update/${actualResumeId}`, formData);
      // The preview image is now included in the response
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
      
      {/* Preview Section */}
      <div className="lg:w-1/2">
        <ResumePreview preview={preview} />
      </div>
    </div>
  );
};

export default Form;