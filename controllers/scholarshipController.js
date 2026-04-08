const Scholarship = require('../models/scholarshipModel');
const nodemailer = require('nodemailer');

// Submit Scholarship Application
exports.submitApplication = async (req, res) => {
    try {
        const { fullName, email } = req.body;
        const documents = req.file ? req.file.path : null;

        // Save application to database
        const application = await Scholarship.createScholarship({ fullName, email, documents, status: 'Pending' });

        // Optionally send confirmation email (skip if not configured)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Scholarship Application Received',
                text: `Dear ${fullName},\n\nYour scholarship application has been received. We will notify you once it is reviewed.\n\nBest regards,\nALIF Foundation`,
            };
            await transporter.sendMail(mailOptions);
        }
        res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while submitting the application.' });
    }
};

// Get All Applications (Admin)
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Scholarship.getAllScholarships();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching applications.' });
    }
};

// Approve or Decline Application
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await Scholarship.updateScholarshipStatus(id, status);
        if (!updated) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        // Optionally notify user of status update (skip if not configured)
        // You may want to fetch the application and send an email here

        res.status(200).json({ message: `Application ${status.toLowerCase()} successfully!` });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the application status.' });
    }
};