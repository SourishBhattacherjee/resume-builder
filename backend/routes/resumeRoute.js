const express = require('express');
const { createResume, updateResume, deleteResume, getResume, downloadResume, getResumeById } = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/create/:id', authMiddleware, createResume);
router.post('/update/:id', authMiddleware, updateResume);
router.delete('/delete/:id', authMiddleware, deleteResume);
router.get('/get/:id', authMiddleware, getResume);
router.get('/download/:id', authMiddleware, downloadResume);
router.get('/resume/:id', authMiddleware, getResumeById);

module.exports = router;