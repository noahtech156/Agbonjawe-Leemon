const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.post('/register', authController.register); // For initial setup only
// router.post('/reset-password', authController.resetPassword); // Handler not implemented

module.exports = router;
