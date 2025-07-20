const fs = require('fs');
const path = require('path');

/**
 * Saves LaTeX content to a .tex file inside a temp directory
 * @param {string} latexContent - The LaTeX content to save
 * @param {string} id - A unique identifier for the resume (e.g., MongoDB ID)
 * @returns {object} - Returns the filename and file path
 */
const saveLatexToFile = (latexContent, id) => {
  const filename = `resume_${id}.tex`;
  const dirPath = path.join(__dirname, '..', 'latex_files');

  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, filename);

  // Write the LaTeX content to the file
  fs.writeFileSync(filePath, latexContent);

  return { filename, filePath };
};

module.exports = saveLatexToFile;
