const generateResumeLatex = require('../helper/latexGenerators');
const saveLatexToFile = require('../helper/saveLatexToFile');
const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');
const { execSync,exec } = require('child_process'); 
const createResume = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name,template } = req.body;

    if (!name || !template) {
      return res.status(400).json({
        success: false,
        message: 'Resume name and template is required'
      });
    }

    const newResume = new Resume({
      user: userId,
      name: name,
      template: template,
      contact: {},
      education: [],
      skills: [],
      experience: [],
      projects: []
    });

    const savedResume = await newResume.save();

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: savedResume
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating resume',
      error: error.message
    });
  }
};
const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedResume = await Resume.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedResume) return res.status(404).json({ error: 'Resume not found' });

    // Generate LaTeX content
    const latex = generateResumeLatex(updatedResume);
    
    // Save LaTeX file
    const { filePath: texPath } = saveLatexToFile(latex, id);
    
    // Compile to PDF
    const pdfPath = texPath.replace('.tex', '.pdf');
    const outputDir = path.dirname(texPath);
    
    try {
      // Compile LaTeX to PDF
      execSync(`pdflatex  -output-directory=${outputDir} ${texPath}`, {
        stdio: 'ignore'
      });
      
      // Cleanup auxiliary files
      ['aux', 'log', 'out'].forEach(ext => {
        try {
          fs.unlinkSync(texPath.replace('.tex', `.${ext}`));
        } catch (e) {}
      });
      
      res.json({ 
        success: true, 
        resume: updatedResume,
        latexFile: path.basename(texPath),
        pdfFile: path.basename(pdfPath)
      });
      
    } catch (compileError) {
      console.error('LaTeX compilation failed:', compileError);
      return res.status(500).json({ 
        error: 'PDF generation failed',
        details: 'LaTeX compilation error',
        latexSaved: path.basename(texPath) // Still return the .tex file info
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResume = await Resume.findByIdAndDelete(id);
    if (!deletedResume) return res.status(404).json({ error: 'Resume not found' });

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
const getResume = async (req, res) => {
  try {
    const userId = req.params.id;
    const resumes = await Resume.find({ user: userId })
      .select('-__v')
      .sort({ createdAt: -1 });

    if (!resumes || resumes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No resumes found for this user'
      });
    }

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resumes',
      error: err.message
    });
  }
};

const downloadResume = async (req, res) => {
  const { id } = req.params;
  const latexDir = path.join(__dirname, '..', 'latex_files');
  const outputDir = path.join(__dirname, '..', 'generated_pdfs');

  try {
    // Create directories if they don't exist
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // Find the latest .tex file for this resume ID
    const files = fs.readdirSync(latexDir);
    const resumeFile = files.find(file => file.startsWith(`resume_${id}`) && file.endsWith('.tex'));
    
    if (!resumeFile) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const texPath = path.join(latexDir, resumeFile);
    const pdfFilename = resumeFile.replace('.tex', '.pdf');
    const pdfPath = path.join(outputDir, pdfFilename);

    // Compile LaTeX to PDF
    await new Promise((resolve, reject) => {
      exec(`pdflatex -output-directory=${outputDir} ${texPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error('LaTeX compilation error:', stderr);
          return reject(new Error('Failed to compile LaTeX'));
        }
        resolve();
      });
    });

    // Check if PDF was generated
    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({ error: 'PDF generation failed' });
    }

    // Delete the .tex file after successful PDF generation
    fs.unlinkSync(texPath); // <-- Cleanup here
    console.log(`Deleted .tex file: ${texPath}`);

    // Send the PDF file
    res.download(pdfPath, pdfFilename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Download failed' });
      }
      fs.unlinkSync(pdfPath); // Delete the PDF after download
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createResume,getResume,updateResume,deleteResume,downloadResume
}