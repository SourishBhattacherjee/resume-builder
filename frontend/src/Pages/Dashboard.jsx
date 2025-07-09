import React, { useState } from 'react';
import ResumePreview from '../Component/ResumePreview';
import PersonalDetailsForm from '../Component/Form/PersonalDetailsForm';
// Future: import EducationForm, ExperienceForm, etc.

const Dashboard = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <PersonalDetailsForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            nextStep={nextStep}
          />
        );
      // case 1: return <EducationForm ... />;
      // case 2: return <ExperienceForm ... />;
      // etc.
      default:
        return <div>All steps complete.</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Forms */}
        <div className="lg:w-1/2 w-full bg-white p-6 rounded-xl shadow-md">
          {renderStep()}
        </div>

        {/* Right: Preview */}
        <div className="lg:w-1/2 w-full">
          <ResumePreview preview={preview} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
