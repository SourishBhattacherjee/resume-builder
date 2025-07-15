const User = require('../models/User');
const Otp = require('../models/Otp')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

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

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // You can optionally fetch fresh user data from DB if needed
    // const user = await User.findById(decoded.userId).select('-password');
    // Return decoded data (or user data from DB)
    res.status(200).json({
      message: 'User data retrieved successfully',
      user: decoded // or user if you fetched from DB
    });
    
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

const getOTP = async(req, res) => {
  const { email } = req.body;
  const OTP = generateRandomSixDigitNumber();
  
  try {
    // Calculate expiration time (10 seconds from now)
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + 120);
    await Otp.findOneAndUpdate(
      { email: email },
      { 
        email: email,
        otp: OTP,
        expires: expires
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'OTP has been sent',
      expiresAt: expires 
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error processing OTP',
      error: error.message
    });
  }
}
const verifyOTP = async(req, res) => {
  const { email, otp } = req.body;
  
  try {
    
    
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      const existsForEmail = await Otp.exists({ email });
      return res.status(400).json({
        message: existsForEmail ? 'Invalid OTP' : 'No OTP requested for this email',
        success: false
      });
    }
    if (record.expires < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ 
        message: 'OTP has expired',
        success: false 
      });
    }
    await Otp.deleteOne({ _id: record._id });
    res.json({ 
      success: true,
      message: 'OTP verified successfully' 
    });

  } catch (e) {
    res.status(500).json({ 
      success: false,
      message: 'Server error during verification',
      error: e.message 
    });
  }
}
const resetPassword = async(req,res) => {
  
}
module.exports = {registerUser,loginUser,getUser,getOTP,verifyOTP,resetPassword}