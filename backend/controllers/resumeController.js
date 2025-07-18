const { generateEducationLatex } = require('../helper/latexGenerators');
const Resume = require('../models/Resume');
const createResume = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Resume name is required'
      });
    }

    const newResume = new Resume({
      user: userId,
      name: name,
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
    const updateData = req.body;

    const updatedResume = await Resume.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    /*// Generate LaTeX from updated education data
    const educationLatex = generateEducationLatex(updatedResume.education);

    // Inject into a LaTeX template (assume placeholders in the template like %%EDUCATION%%)
    const fs = require('fs');
    const template = fs.readFileSync('templates/resume_template.tex', 'utf8');
    const filledTemplate = template.replace('%%EDUCATION%%', educationLatex);

    // Optionally save to disk or compile with pdflatex here
    fs.writeFileSync(`generated/resume_${id}.tex`, filledTemplate);*/  //for latex part

    res.json({ success: true, message: 'Resume updated and LaTeX generated.', resume: updatedResume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const deleteResume = (req,res) => {
  
}
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

module.exports = {
  createResume,getResume,updateResume,deleteResume
}