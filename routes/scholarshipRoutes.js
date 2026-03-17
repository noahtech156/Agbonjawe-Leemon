const express = require('express');
const multer = require('multer');
const { submitApplication, getAllApplications, updateApplicationStatus } = require('../controllers/scholarshipController');

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/apply', upload.single('documents'), submitApplication);
router.get('/applications', getAllApplications);
router.patch('/applications/:id', updateApplicationStatus);

module.exports = router;