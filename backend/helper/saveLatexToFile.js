const fs = require('fs');
const path = require('path');

function saveLatexToFile(latexContent, id) {
  const dir = path.join(__dirname, '..', 'latex_files');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Delete any existing files with the same resume ID
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.startsWith(`resume_${id}_`)) {
      fs.unlinkSync(path.join(dir, file));
    }
  });

  // Create new file
  const filename = `resume_${id}.tex`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, latexContent);
  
  return { filename, filePath };
}

module.exports = saveLatexToFile;