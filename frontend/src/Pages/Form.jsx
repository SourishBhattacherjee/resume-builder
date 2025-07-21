import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import PersonalDetails from '../Component/Form/PersonalDetails';
import Education from '../Component/Form/Education';
import Experience from '../Component/Form/Experience';
import Projects from '../Component/Form/Projects';
import Certifications from '../Component/Form/Certifications';
import Additional from '../Component/Form/Additional';

const Form = () => {
  const { resume_id, id } = useParams();
  // Use whichever parameter exists
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

  useEffect(() => {
    const fetchResume = async () => {
      try {
        console.log('Resume ID from params:', actualResumeId); // Debug log
        
        if (actualResumeId) {
          console.log('Making API call to:', `http://localhost:7000/resume/${actualResumeId}`);
          
          const response = await axios.get(`http://localhost:7000/resume/${actualResumeId}`);
          
          console.log('API Response Status:', response.status);
          console.log('API Response Headers:', response.headers);
          console.log('Fetched resume data:', response.data); // This should now log
          console.log('Type of response.data:', typeof response.data);
          console.log('Is response.data an object?', typeof response.data === 'object');
          
          // Additional debugging
          if (response.data) {
            console.log('Keys in response.data:', Object.keys(response.data));
          }
          
          setFormData({
            ...response.data,
            // Ensure arrays exist
            personalDetails: response.data.personalDetails || [{}],
            education: response.data.education || [{}],
            experience: response.data.experience || [{}],
            projects: response.data.projects || [{}],
            certifications: response.data.certifications || [{}],
            skills: response.data.skills || [],
            languages: response.data.languages || [],
          });
          
          console.log('FormData after setting:', formData); // Note: This might show old state due to async nature
        } else {
          console.log('No resume ID provided, skipping API call');
        }
      } catch (err) {
        console.error('Full error object:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        
        setError(`Failed to load resume: ${err.message}`);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchResume();
  }, [actualResumeId]);

  // Add this useEffect to log formData changes
  useEffect(() => {
    console.log('FormData updated:', formData);
  }, [formData]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      console.log('Submitting form data:', formData);
      
      if (actualResumeId) {
        const response = await axios.post(`http://localhost:7000/update/${actualResumeId}`, formData);
      } else {
        const response = await axios.post('http://localhost:7000/resume', formData);
        console.log('Create response:', response.data);
        alert('Resume created successfully!');
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="text-xl font-bold mb-6 text-center">Step {step + 1} of 6</div>
      {renderStep()}
    </div>
  );
};

export default Form;