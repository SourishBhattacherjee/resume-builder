const User = require('../models/User');
const Otp = require('../models/Otp')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {sendOTPEmail}  = require('../helper/mail')
const redisClient = require('../utils/redis');

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
      process.env.SECRET_KEY,
       { expiresIn: '1h' }
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
    res.status(200).json({
      message: 'User data retrieved successfully',
      user: decoded
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

const getOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Verify user exists in DB
    const userExists = await User.exists({ email });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address",
      });
    }

    const OTP = generateRandomSixDigitNumber();
    // Convert to string for bcrypt
    const hashedOTP = await bcrypt.hash(OTP.toString(), 10);

    await redisClient.set(`otp:${email}`, hashedOTP, { EX: 120 });

    // Send OTP to email (ensure sendOTPEmail can handle string)
    await sendOTPEmail(email, OTP.toString());

    res.status(200).json({
      success: true,
      message: "OTP has been sent to registered email",
      expiresIn: "120 seconds",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing OTP request",
      error: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOTP = await redisClient.get(`otp:${email}`);

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "No OTP found or OTP expired",
      });
    }

    // Convert input OTP to string for comparison
    const isMatch = await bcrypt.compare(otp.toString(), storedOTP);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP verified → remove it
    await redisClient.del(`otp:${email}`);

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server error during verification",
      error: e.message,
    });
  }
};
const resetPassword = async(req, res) => {
  const { email, password } = req.body;
  
  try {
    const userExists = await User.exists({ email });
    
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword }
    );

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: e.message
    });
  }
}


module.exports = {registerUser,loginUser,getUser,getOTP,verifyOTP,resetPassword}