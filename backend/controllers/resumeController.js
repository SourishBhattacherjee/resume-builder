const { generateResumeLatex, saveLatexToFile } = require('../helper/latexGenerators');
const Resume = require('../models/Resume');
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
    const updateData = req.body;

    const updatedResume = await Resume.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Generate LaTeX content
    const latexContent = generateResumeLatex(updatedResume);
    
    // Save to file
    const { filename } = saveLatexToFile(latexContent, id);

    res.json({ 
      success: true, 
      message: 'Resume updated and LaTeX generated.', 
      resume: updatedResume,
      latexFile: filename
    });
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