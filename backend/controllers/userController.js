const User = require('../models/User');
const bcrypt = require('bcryptjs')

const registerUser = async (req,res) => {
  try {
    const {fullName,email,password} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message : 'User alreday exist. Please Login'});
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password,10);

    //create new user;
    const newUser = new User({
      fullName,
      email,
      password : hashedPassword
    })
    await newUser.save();
    res.status(201).json({message : 'User Registered Succesfully'})
  }
  catch(err){
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {registerUser}