const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const { adminRegister } = require('../controllers/authController');

// Admin register endpoint
router.post('/admin-register', adminRegister);
router.post('/login', authController.login);
router.post('/register', authController.register); // For initial setup only
router.get('/verify', requireAuth, authController.verify); // Verify token
// router.post('/reset-password', authController.resetPassword); // Handler not implemented

module.exports = router;
