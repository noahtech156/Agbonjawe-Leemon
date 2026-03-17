const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', (req, res) => {
  res.redirect('/admin-dashboard.html');
});

router.post('/register', authController.register); // For initial setup only
router.post('/reset-password', authController.resetPassword);

module.exports = router;
