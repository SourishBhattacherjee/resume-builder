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
  title: {
    type: String,
    required: true
  },
  company: {
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
  description: String,
  responsibilities: [String]
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [String],
  startDate: Date,
  endDate: Date,
  url: String,
  githubRepo: String
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  category: {
    type: String,
    enum: ['Programming Language', 'Framework', 'Tool', 'Language', 'Other'],
    default: 'Programming Language'
  }
});

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
  title: String,
  contact: {
    email: String,
    phone: String,
    address: String,
    website: String,
    linkedin: String,
    github: String
  },
  summary: String,
  education: [educationSchema],
  skills: [skillSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  certifications: [{
    name: String,
    issuer: String,
    dateObtained: Date,
    expirationDate: Date,
    credentialId: String
  }],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Fluent', 'Native']
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;