const Scholarship = require('../models/scholarshipModel');
const nodemailer = require('nodemailer');

// Submit Scholarship Application
exports.submitApplication = async (req, res) => {
    try {
        const { fullName, email } = req.body;
        const documents = req.file.path;

        // Save application to database
        const application = await Scholarship.create({ fullName, email, documents, status: 'Pending' });

        // Send confirmation email
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

        res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while submitting the application.' });
    }
};

// Get All Applications (Admin)
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Scholarship.find();
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

        const application = await Scholarship.findByIdAndUpdate(id, { status }, { new: true });

        if (!application) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        // Notify user of status update
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: application.email,
            subject: `Scholarship Application ${status}`,
            text: `Dear ${application.fullName},\n\nYour scholarship application has been ${status.toLowerCase()}.\n\nBest regards,\nALIF Foundation`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: `Application ${status.toLowerCase()} successfully!` });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the application status.' });
    }
};