// utils/latexGenerator.js
const path = require('path');
const fs = require('fs');

const generateResumeLatex = (resumeData) => {
  const personal = resumeData.personalDetails[0];

  let latex = `\\documentclass[10pt]{extarticle}
\\usepackage[margin=0.7in]{geometry}
\\usepackage{amsmath,amssymb}
\\usepackage{hyperref}
\\hypersetup{colorlinks=true,urlcolor=blue}
\\usepackage{enumitem}
\\setlist[itemize]{leftmargin=*, itemsep=0pt, topsep=2pt}
\\usepackage{titlesec}
\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}
\\renewcommand{\\familydefault}{\\sfdefault}
\\pagenumbering{gobble}

\\begin{document}

% === NAME SECTION ===
\\begin{center}
{\\huge \\bfseries ${escapeLatex(personal.fullName)}}\\\\[4pt]
\\small
\\href{mailto:${escapeLatex(personal.email)}}{${escapeLatex(personal.email)}} $\\vert$
\\href{${escapeLatex(personal.linkedin || '#')}}{LinkedIn} $\\vert$
\\href{${escapeLatex(personal.github || '#')}}{GitHub}
\\end{center}

`;

  // Education section
  if (resumeData.education?.length > 0) {
    latex += `\\section*{Education}\n\\begin{itemize}\n`;
    resumeData.education.forEach(edu => {
      latex += `  \\item \\textbf{${escapeLatex(edu.institution)}} \\hfill ${formatDate(edu.startDate)} -- ${formatDate(edu.endDate)}\\\\\n`;
      latex += `  ${escapeLatex(edu.degree)}\\\\\n`;
      if (edu.relatedCoursework) {
        latex += `  \\textit{Related Coursework:} ${escapeLatex(edu.relatedCoursework)}\n`;
      }
    });
    latex += `\\end{itemize}\n\n`;
  }

  // Experience section
  if (resumeData.experience?.length > 0) {
    latex += `\\section*{Experience}\n`;
    resumeData.experience.forEach(exp => {
      const endDate = exp.currentlyWorking ? 'Present' : formatDate(exp.endDate);
      latex += `\\textbf{${escapeLatex(exp.companyName)}} \\hfill ${escapeLatex(exp.location)}\\\\\n`;
      latex += `\\textit{${formatDate(exp.startDate)} -- ${endDate}}\\\\\n\\begin{itemize}\n`;
      exp.responsibilities.forEach(resp => {
        latex += `  \\item ${escapeLatex(resp)}\n`;
      });
      latex += `\\end{itemize}\n`;
    });
    latex += `\n`;
  }

  // Projects section
  if (resumeData.projects?.length > 0) {
    latex += `\\section*{Projects}\n\\begin{itemize}\n`;
    resumeData.projects.forEach(proj => {
      latex += `  \\item \\href{${escapeLatex(proj.link || '#')}}{\\textbf{${escapeLatex(proj.name)}}}\n  \\begin{itemize}\n`;
      proj.description.forEach(desc => {
        latex += `    \\item ${escapeLatex(desc)}\n`;
      });
      latex += `  \\end{itemize}\n`;
    });
    latex += `\\end{itemize}\n\n`;
  }

  // Skills section
  if (resumeData.skills?.length > 0) {
    latex += `\\section*{Skills}\n\\begin{itemize}\n`;
    latex += `  \\item ${resumeData.skills.map(skill => escapeLatex(skill)).join(' $\\bullet$ ')}\n`;
    latex += `\\end{itemize}\n\n`;
  }

  // Languages section
  if (resumeData.languages?.length > 0) {
    latex += `\\section*{Languages}\n\\begin{itemize}\n`;
    latex += `  \\item ${resumeData.languages.map(lang => escapeLatex(lang)).join(', ')}\n`;
    latex += `\\end{itemize}\n\n`;
  }

  // Certifications section
  if (resumeData.certifications?.length > 0) {
    latex += `\\section*{Certifications}\n\\begin{itemize}\n`;
    resumeData.certifications.forEach(cert => {
      latex += `  \\item \\href{${escapeLatex(cert.link || '#')}}{${escapeLatex(cert.name)}}\n`;
    });
    latex += `\\end{itemize}\n\n`;
  }

  latex += `\\end{document}`;

  return latex;
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Helper function to escape LaTeX special characters
const escapeLatex = (text) => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde')
    .replace(/\^/g, '\\textasciicircum');
};

// Function to save LaTeX to file
const saveLatexToFile = (latexContent, id) => {
  const dir = path.join(__dirname, '../generated');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filename = `resume_${id}_${Date.now()}.tex`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, latexContent);
  
  return { filename, filePath };
};

module.exports = {
  generateResumeLatex,
  saveLatexToFile
};