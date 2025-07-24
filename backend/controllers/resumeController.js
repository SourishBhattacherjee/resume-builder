const generateResumeLatex = require('../helper/latexGenerators');
const { createClient } = require('@supabase/supabase-js');
const saveLatexToFile = require('../helper/saveLatexToFile');
const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');
const { execSync,exec } = require('child_process');
const connectDB = require('../utils/db');

const TEMP_DIR = path.join(__dirname, '..', 'temp_files');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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

    // Ensure temp directory exists
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // Save LaTeX file locally for compilation
    const texPath = path.join(TEMP_DIR, `resume_${id}.tex`);
    fs.writeFileSync(texPath, latex);

    // Compile to PDF
    const outputDir = TEMP_DIR;
    const baseName = `resume_${id}`;
    const pdfPath = path.join(outputDir, `${baseName}.pdf`);

    try {
      // 1. Compile LaTeX to PDF
      execSync(`pdflatex -interaction=nonstopmode -output-directory=${outputDir} ${texPath}`, {
        stdio: 'ignore',
      });

      // 2. Convert PDF to PNG using Ghostscript
      const pngPath = path.join(outputDir, `${baseName}.png`);
      execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r150 -sOutputFile=${pngPath} ${pdfPath}`);

      // 3. Upload files to Supabase with upsert to overwrite existing files
      const filesToUpload = [
        { path: texPath, key: `resumes/${id}/${baseName}.tex`, contentType: 'text/x-tex' },
        { path: pdfPath, key: `resumes/${id}/${baseName}.pdf`, contentType: 'application/pdf' },
        { path: pngPath, key: `resumes/${id}/${baseName}.png`, contentType: 'image/png' },
      ];

      for (const file of filesToUpload) {
        const fileContent = fs.readFileSync(file.path);
        const { error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(file.key, fileContent, { 
            contentType: file.contentType,
            upsert: true // Overwrite if file exists
          });
        if (error) {
          console.error(`Error uploading ${file.key}:`, error);
          throw error;
        }
      }

      // 4. Read PNG for base64
      const imageBuffer = fs.readFileSync(pngPath);
      const base64Image = imageBuffer.toString('base64');

      // 5. Cleanup local files (including auxiliary files)
      const auxFiles = [
        '.aux', '.log', '.out', '.toc', '.lof', '.lot', '.bbl', '.blg', '.synctex.gz',
        '.tex', '.pdf', '.png',
      ];
      auxFiles.forEach(ext => {
        const filePath = path.join(outputDir, `${baseName}${ext}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // 6. Update resume in database
      const resumeWithPreview = await Resume.findByIdAndUpdate(
        id,
        {
          ...req.body,
          previewImage: `data:image/png;base64,${base64Image}`,
          pdfPath: `resumes/${id}/${baseName}.pdf`,
          latexPath: `resumes/${id}/${baseName}.tex`,
        },
        { new: true },
      );

      res.json({
        success: true,
        resume: resumeWithPreview,
        latexFile: `${baseName}.tex`,
        pdfFile: `${baseName}.pdf`,
        previewImage: `data:image/png;base64,${base64Image}`,
      });

    } catch (compileError) {
      console.error('Processing failed:', compileError);
      return res.status(500).json({
        error: 'PDF generation failed',
        details: compileError.message,
        latexSaved: `${baseName}.tex`,
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

    // Find resume to get file paths
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    // Delete from database
    await Resume.findByIdAndDelete(id);

    // Delete files from Supabase
    const extensions = ['.tex', '.pdf', '.png'];
    const fileKeys = extensions.map(ext => `resumes/${id}/resume_${id}${ext}`);
    
    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove(fileKeys);
    
    if (error) {
      console.error('Error deleting files from Supabase:', error);
      throw error;
    }

    res.json({
      success: true,
      message: 'Resume and all associated files deleted successfully',
    });

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

  try {
    connectDB();

    // Find the resume to verify it exists
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    // Download PDF from Supabase
    const pdfKey = `resumes/${id}/resume_${id}.pdf`;
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .download(pdfKey);

    if (error) {
      console.error('Error downloading PDF:', error);
      return res.status(404).json({ error: 'Resume PDF not found' });
    }

    // Convert to buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume_${id}.pdf"`);

    // Send the file
    res.send(buffer);

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