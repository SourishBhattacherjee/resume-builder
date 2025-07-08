import React from 'react';

const ResumePreview = ({ preview }) => {
  return (
    <div className="h-full p-6 bg-gray-50 rounded-xl shadow-lg overflow-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume Preview</h2>
      {preview ? (
        <div className="w-full max-h-[80vh] overflow-auto border border-gray-300 rounded-lg p-2 bg-white">
          <img
            src={preview}
            alt="Resume Preview"
            className="w-full h-auto max-h-[70vh] object-contain mx-auto"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 px-4 text-center">
            Complete the form to generate your resume preview
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
