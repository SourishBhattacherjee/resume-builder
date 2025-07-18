const mongoose = require('mongoose');
const resumeSchema = new mongoose.Schema({
  _id:{
    type:Object,
    ref:'User'
  },
  Name:{
    type:String,
    required:true
  }
})

const Resume = mongoose.model('Resume',resumeSchema);
module.exports = Resume;