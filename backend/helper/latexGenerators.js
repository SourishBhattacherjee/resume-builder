const fs = require('fs');
const path = require('path');

const escapeLatex = text => (text||'')
  .replace(/\\/g,'\\textbackslash ')
  .replace(/&/g,'\\&').replace(/%/g,'\\%')
  .replace(/\$/g,'\\$').replace(/#/g,'\\#')
  .replace(/_/g,'\\_').replace(/{/g,'\\{')
  .replace(/}/g,'\\}').replace(/~/g,'\\textasciitilde ')
  .replace(/\^/g,'\\textasciicircum ');

const formatDate = d => {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US',{ month:'short', year:'numeric' });
};

const formatEducation = edArr => edArr.map(e =>
  `\\noindent\\textbf{${escapeLatex(e.institution)}} \\hfill ${formatDate(e.startDate)}--${formatDate(e.endDate)}\\\\\n` +
  `${escapeLatex(e.degree)}\\\\\n` +
  (e.relatedCoursework ? `\\textit{Related Coursework:} ${escapeLatex(e.relatedCoursework)}\\\\\n` : '')
).join('\n');

const formatExperience = exArr => exArr.map(e => {
  const end = e.currentlyWorking ? 'Present' : formatDate(e.endDate);
  return `\\noindent\\textbf{${escapeLatex(e.companyName)}} \\hfill ${escapeLatex(e.location)}\\\\\n` +
    `\\textit{${formatDate(e.startDate)}--${end}}\\\\\n` +
    '\\begin{itemize}\n' +
    e.responsibilities.map(r => `  \\item ${escapeLatex(r)}\n`).join('') +
    '\\end{itemize}\n';
}).join('\n');

const formatProjects = prArr => prArr.map(p =>
  `\\noindent\\textbf{${escapeLatex(p.name)}}: \\href{${escapeLatex(p.link)}}{Link}\\\\\n` +
  '\\begin{itemize}\n' +
  p.description.map(d => `  \\item ${escapeLatex(d)}\n`).join('') +
  '\\end{itemize}\n'
).join('\n');

const formatList = (arr, templateType) => {
  const escapedArr = arr
    .filter(item => item && item.trim().length > 0) // Remove empty items
    .map(a => escapeLatex(a.trim())); // Trim whitespace

  if (templateType === 'template2' || templateType === 'template4') {
    // Return ready-to-use LaTeX itemize content
    return escapedArr.join(' \\\\\n\\item ');
  }
  return escapedArr.join(' $\\bullet$ ');
};

function generateResumeLatex(resumeData) {
  const tmpl = resumeData.template || 'template1';
  const tplPath = path.join(__dirname, 'templates', `${tmpl}.tex`);
  if (!fs.existsSync(tplPath)) throw new Error(`Missing template: ${tmpl}`);

  let content = fs.readFileSync(tplPath, 'utf8');

  const personal = resumeData.personalDetails?.[0] || {};
  const tokens = {
    fullName: escapeLatex(personal.fullName || ''),
    email: escapeLatex(personal.email || ''),
    linkedin: escapeLatex(personal.linkedin || ''),
    github: escapeLatex(personal.github || ''),
    education: formatEducation(resumeData.education || []),
    experience: formatExperience(resumeData.experience || []),
    projects: formatProjects(resumeData.projects || []),
    skills: formatList(resumeData.skills || [], tmpl),
    languages: formatList(resumeData.languages || [], tmpl),
    certifications: formatList(
      (resumeData.certifications || []).map(c => c.name), 
      tmpl
    )
  };

  Object.entries(tokens).forEach(([key, val]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), val);
  });

  return content;
}
module.exports = generateResumeLatex;
