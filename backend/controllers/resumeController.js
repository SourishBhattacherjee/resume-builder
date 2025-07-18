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
const updateResume = (req,res) => {
  
}
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