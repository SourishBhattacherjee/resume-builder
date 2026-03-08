const express = require('express');
const { registerUser, loginUser, getUser, getOTP, verifyOTP, resetPassword, updateProfile } = require('../controllers/userController');
const { upload } = require('../utils/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUser);
router.post('/send-otp', getOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.put('/update-profile', authMiddleware, upload.single('picture'), updateProfile);


module.exports = router;