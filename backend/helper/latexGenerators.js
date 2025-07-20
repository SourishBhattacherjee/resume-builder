const path = require('path');
const fs = require('fs');

// Individual template generators
const template1 = require('./templates')
const template2 = require('./templates/template2');
const template3 = require('./templates/template3');

const generateResumeLatex = (resumeData) => {
  const template = resumeData.template || 'template1'; // fallback

  // Dynamically call the right template function
  let latex = '';
  switch (template) {
    case 'template2':
      latex = template2(resumeData);
      break;
    case 'template3':
      latex = template3(resumeData);
      break;
    case 'template1':
    default:
      latex = template1(resumeData);
  }

  return latex;
};

module.exports = generateResumeLatex;
