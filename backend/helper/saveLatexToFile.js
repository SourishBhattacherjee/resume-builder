const fs = require('fs');
const path = require('path');

function saveLatexToFile(latexContent, id) {
  const dir = path.join(__dirname, '..', 'latex_files');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filename = `resume_${id}_${Date.now()}.tex`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, latexContent);
  return { filename, filePath };
}

module.exports = saveLatexToFile;
