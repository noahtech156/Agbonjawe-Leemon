const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  // Automatically redirect to dashboard without login
  res.redirect('/admin-dashboard.html');
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });
  if (userModel.getUserByUsername(username)) return res.status(400).json({ success: false, message: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, password: hash };
  userModel.createUser(user);
  res.status(201).json({ success: true, data: { username: user.username } });
};

exports.resetPassword = async (req, res) => {
  const { username, newPassword } = req.body;
  const user = userModel.getUserByUsername(username);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash(newPassword, 10);
  userModel.updateUserPassword(username, hash);
  res.json({ success: true, message: 'Password reset successful' });
};
