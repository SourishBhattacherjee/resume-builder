import React from 'react';


const ResumePreview = ({ preview }) => {
  if (!preview) {
    return (
      <div className="w-full h-[75vh] flex items-center justify-center border rounded bg-white">
        <p>No preview available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[75vh] border rounded bg-white">
      <iframe
        key={preview} // 🔥 IMPORTANT (forces re-render)
        src={preview}
        title="Resume Preview"
        className="w-full h-full"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default ResumePreview;
