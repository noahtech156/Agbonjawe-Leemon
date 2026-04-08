const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { adminRegister } = require('../controllers/authController');

// Admin register endpoint
router.post('/admin-register', adminRegister);
router.post('/login', authController.login);
router.post('/register', authController.register); // For initial setup only
// router.post('/reset-password', authController.resetPassword); // Handler not implemented

module.exports = router;
