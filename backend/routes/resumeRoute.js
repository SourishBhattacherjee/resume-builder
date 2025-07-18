const express = require('express');
const { createResume,updateResume,deleteResume,readResume } = require('../controllers/resumeController');
const router = express.Router();


router.post('/create/:id',createResume);
router.post('/update/:id',updateResume);
router.delete('/delete/:id',deleteResume);
router.get('/read/:id',readResume);

module.exports = router;