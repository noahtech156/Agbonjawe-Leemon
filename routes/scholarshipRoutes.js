const express = require('express');
const multer = require('multer');
const { submitApplication, getAllApplications, updateApplicationStatus } = require('../controllers/scholarshipController');
const validateInput = require('../middleware/validateInput');

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/apply', upload.single('documents'), validateInput(['fullName', 'email']), submitApplication);
router.get('/applications', getAllApplications);
router.patch('/applications/:id', updateApplicationStatus);
// For admin UI compatibility (PUT for status update)
router.put('/:id/status', updateApplicationStatus);

module.exports = router;