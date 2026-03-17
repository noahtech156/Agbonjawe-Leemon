const { v4: uuidv4 } = require('uuid');
const contactModel = require('../models/contactModel');

exports.createMessage = (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }
  const msg = {
    id: uuidv4(),
    name,
    email,
    phone,
    message,
    created_at: new Date().toISOString()
  };
  contactModel.createMessage(msg);
  res.status(201).json({ success: true, data: msg });
};

exports.getMessages = (req, res) => {
  const messages = contactModel.getAllMessages();
  res.json({ success: true, data: messages });
};
