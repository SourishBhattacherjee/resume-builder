// utils/latexGenerators.js
function generateEducationLatex(educations) {
  return educations.map(edu => {
    const from = new Date(edu.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    const to = edu.endDate
      ? new Date(edu.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
      : 'Present';

    return `
\\resumeSubheading
  {${edu.institution}}{}{${from} -- ${to}}
  {${edu.degree}}{${edu.relatedCoursework || ''}}`;
  }).join('\n');
}
module.exports = { generateEducationLatex };
