const express = require('express');
const { registerUser, loginUser,getUser,getOTP,verifyOTP,resetPassword } = require('../controllers/userController');
const router = express.Router();


router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',getUser);
router.post('/send-otp',getOTP);
router.get('/verify-otp',verifyOTP);
router.post('/reset-password',resetPassword);


module.exports = router;