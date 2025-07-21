const generateResumeLatex = require('../helper/latexGenerators');
const saveLatexToFile = require('../helper/saveLatexToFile');
const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');
const { execSync,exec } = require('child_process');
const connectDB = require('../utils/db');
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
    connectDB();
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
      // 1. Compile LaTeX to PDF
      execSync(`pdflatex -output-directory=${outputDir} ${texPath}`, {
        stdio: 'ignore'
      });
      
      // 2. Convert PDF to PNG using Ghostscript
      const pngPath = pdfPath.replace('.pdf', '.png');
      execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r150 -sOutputFile=${pngPath} ${pdfPath}`);
      
      // 3. Read the PNG file and convert to base64
      const imageBuffer = fs.readFileSync(pngPath);
      const base64Image = imageBuffer.toString('base64');
      
      // 4. Cleanup auxiliary files
      ['aux', 'log', 'out'].forEach(ext => {
        try {
          fs.unlinkSync(texPath.replace('.tex', `.${ext}`));
        } catch (e) {}
      });

      // 5. Update the resume with the preview image in the database
      const resumeWithPreview = await Resume.findByIdAndUpdate(
        id,
        { 
          ...req.body,
          previewImage: `data:image/png;base64,${base64Image}`,
          pdfPath: path.basename(pdfPath),
          latexPath: path.basename(texPath)
        },
        { new: true }
      );
      
      res.json({ 
        success: true, 
        resume: resumeWithPreview,
        latexFile: path.basename(texPath),
        pdfFile: path.basename(pdfPath),
        previewImage: `data:image/png;base64,${base64Image}`
      });
      
    } catch (compileError) {
      console.error('Processing failed:', compileError);
      return res.status(500).json({ 
        error: 'PDF generation failed',
        details: compileError.message,
        latexSaved: path.basename(texPath)
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
const deleteResume = async (req, res) => {
  try {
    connectDB();
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
    connectDB();
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
  const outputDir = path.join(__dirname, '..', 'latex_files');

  try {
    // Check if PDF directory exists
    connectDB();
    if (!fs.existsSync(outputDir)) {
      return res.status(404).json({ error: 'No resumes generated yet' });
    }
    const existingTexFiles = fs.readdirSync(outputDir).filter(file => 
      file.startsWith(`resume_${id}`) && file.endsWith('.tex')
    );
    
    existingTexFiles.forEach(texFile => {
      try {
        fs.unlinkSync(path.join(outputDir, texFile));
      } catch (err) {
        console.error(`Error deleting .tex file ${texFile}:`, err);
      }
    });

    // Find the PDF file for this resume ID
    const pdfFiles = fs.readdirSync(outputDir);
    const pdfFilename = pdfFiles.find(file => 
      file.startsWith(`resume_${id}`) && file.endsWith('.pdf')
    );

    if (!pdfFilename) {
      return res.status(404).json({ error: 'Resume PDF not found' });
    }

    const pdfPath = path.join(outputDir, pdfFilename);

    // Set proper headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);

    // Create read stream
    const fileStream = fs.createReadStream(pdfPath);
    
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming PDF file' });
      }
    });

    // Pipe the file to the response
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};
const getResumeById = async (req, res) => {
  try {
    connectDB();
    const resumeId = req.params.id;
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createResume,getResume,updateResume,deleteResume,downloadResume,getResumeById
}