const generateResumeLatex = require('../helper/latexGenerators');
const saveLatexToFile = require('../helper/saveLatexToFile');
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
    const updatedResume = await Resume.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedResume) return res.status(404).json({ error: 'Resume not found' });

    const latex = generateResumeLatex(updatedResume);
    const { filename } = saveLatexToFile(latex, id);

    res.json({ success: true, resume: updatedResume, latexFile: filename });
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

module.exports = {
  createResume,getResume,updateResume,deleteResume
}