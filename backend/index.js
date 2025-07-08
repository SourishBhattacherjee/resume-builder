// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors')


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to process LaTeX
app.post('/generate-resume', async (req, res) => {
  const tempDir = './Templates';
  const { fullName } = req.body;

  try {
    // 1. Generate LaTeX
    const texContent = `\\documentclass{article}\\begin{document}Sourish Bhattacharjee\\end{document}`;
    const texPath = `${tempDir}/resume.tex`;
    fs.writeFileSync(texPath, texContent);

    // 2. Compile PDF
    await exec(`pdflatex -output-directory=${tempDir} ${texPath}`);

    // 3. Convert to PNG (using Ghostscript directly)
    const pdfPath = `${tempDir}/resume.pdf`;
    const pngPath = `${tempDir}/resume.png`;
    
    await exec(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r100 -sOutputFile=${pngPath} ${pdfPath}`);

    // 4. Return as base64-encoded image
    const imageBuffer = fs.readFileSync(pngPath);
    const base64Image = imageBuffer.toString('base64');
    
    res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(7000, () => console.log('Server running on port 7000'));