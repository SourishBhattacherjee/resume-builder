const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  picture: {
    type: String,    
    default: null          
  }

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;