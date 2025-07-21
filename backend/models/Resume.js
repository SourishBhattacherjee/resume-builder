const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  relatedCoursework: {
    type: String,
    required: true
  }
});

const experienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  location: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  currentlyWorking: {
    type: Boolean,
    default: false
  },
  responsibilities: [String]
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  link: String,
  description: [String]
});


const personalSchema = new mongoose.Schema({
  fullName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  linkedin:{
    type:String,
    required:true
  },
  github:{
    type:String,
    required:true
  }
})

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  template:{
    type: String,
    enum:['template1', 'template2', 'template3','template4'],
    default: 'template1'
  },
  personalDetails: [personalSchema],
  summary: String,
  education: [educationSchema],
  skills: [String],
  experience: [experienceSchema],
  projects: [projectSchema],
  certifications: [{
    name: String,
    link:String
  }],
  languages: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  previewImage: String
});

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;