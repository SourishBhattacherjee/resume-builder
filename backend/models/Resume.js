const mongoose = require('mongoose');

// ---------------- Education ----------------
const educationSchema = new mongoose.Schema({
  institution: { type: String, default: "" },
  degree: { type: String, default: "" },
  startDate: { type: Date },
  endDate: { type: Date },
  relatedCoursework: { type: String, default: "" }
}, { _id: false });

// ---------------- Experience ----------------
const experienceSchema = new mongoose.Schema({
  companyName: { type: String, default: "" },
  location: { type: String, default: "" },
  startDate: { type: Date },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, default: false },
  responsibilities: [{ type: String }]
}, { _id: false });

// ---------------- Projects ----------------
const projectSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  link: { type: String, default: "" },
  description: [{ type: String }]
}, { _id: false });

// ---------------- Personal Details ----------------
const personalSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  email: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" }
}, { _id: false });

// ---------------- Resume ----------------
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
  template: {
    type: String,
    enum: ['template1', 'template2', 'template3', 'template4'],
    default: 'template1'
  },

  personalDetails: {
    type: [personalSchema],
    default: [{}]  // ensures safe access [0]
  },

  summary: { type: String, default: "" },

  education: {
    type: [educationSchema],
    default: []
  },

  skills: {
    type: [String],
    default: []
  },

  experience: {
    type: [experienceSchema],
    default: []
  },

  projects: {
    type: [projectSchema],
    default: []
  },

  certifications: {
    type: [{
      name: { type: String, default: "" },
      link: { type: String, default: "" }
    }],
    default: []
  },

  languages: {
    type: [String],
    default: []
  },

  pdfPath: { type: String },
  latexPath: { type: String },

  lastUpdated: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;