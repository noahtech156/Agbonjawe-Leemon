// Appreciation message to all users with disbursement
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
exports.sendAppreciationToAll = async (req, res) => {
    try {
        const disbursements = await Disbursement.getAllDisbursements();
        const userIds = [...new Set(disbursements.map(d => d.user_id))];
        const users = await Promise.all(userIds.map(id => userModel.getUserById(id)));
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            for (const user of users) {
                if (user && user.email) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: 'Appreciation from ALIF Foundation',
                        text: `Dear ${user.name},\n\nThank you for being part of our scholarship program. Your disbursement has been processed.\n\nBest regards,\nALIF Foundation`,
                    };
                    await transporter.sendMail(mailOptions);
                }
            }
        }
        res.status(200).json({ message: 'Appreciation sent to all users.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send appreciation.' });
    }
};
const Disbursement = require('../models/disbursementModel');

// Create a new disbursement (user)
exports.createDisbursement = async (req, res) => {
    try {
        const userId = req.user.id;
        // Accept all form fields as details
        const details = req.body;
        const amount = details.amount || 0;
        const disbursement = await Disbursement.createDisbursement(userId, amount, details);
        res.status(201).json(disbursement);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create disbursement.' });
    }
};

// Get all disbursements for the logged-in user
exports.getUserDisbursements = async (req, res) => {
    try {
        const userId = req.user.id;
        const disbursements = await Disbursement.getUserDisbursements(userId);
        res.status(200).json(disbursements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch disbursements.' });
    }
};

// Get all disbursements (admin)
exports.getAllDisbursements = async (req, res) => {
    try {
        const disbursements = await Disbursement.getAllDisbursements();
        res.status(200).json(disbursements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all disbursements.' });
    }
};
