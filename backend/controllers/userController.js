const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

const loginUser = async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email,fullName: user.fullName }, //payload
      process.env.SECRET_KEY
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const getUser = async (req,res) =>{
  
}

module.exports = {registerUser,loginUser,getUser}