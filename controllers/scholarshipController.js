const Scholarship = require('../models/scholarshipModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Submit Scholarship Application
exports.submitApplication = async (req, res) => {
    try {
        const { fullName, email } = req.body;
        const documents = req.file ? req.file.path : null;
        console.log(`[submitApplication] New application from: ${email}`);
        // Save application to database
        const application = await Scholarship.createScholarship({ fullName, email, documents, status: 'Pending' });
        console.log(`[submitApplication] Application created with ID: ${application.id}`);
        // Send confirmation email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
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
                console.log(`[submitApplication] Confirmation email sent to: ${email}`);
            } catch (mailErr) {
                console.warn(`[submitApplication] Failed to send email: ${mailErr.message}`);
            }
        }
        res.status(201).json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
        console.error(`[submitApplication] Error: ${error.message}`);
        res.status(500).json({ success: false, error: 'An error occurred while submitting the application.' });
    }
};

// Get All Applications (Admin)
exports.getAllApplications = async (req, res) => {
    try {
        console.log(`[getAllApplications] Fetching all scholarship applications`);
        const applications = await Scholarship.getAllScholarships();
        console.log(`[getAllApplications] Found ${applications.length} applications`);
        res.status(200).json(applications);
    } catch (error) {
        console.error(`[getAllApplications] Error: ${error.message}`);
        res.status(500).json({ success: false, error: 'An error occurred while fetching applications.' });
    }
};

// Approve or Decline Application
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log(`[updateApplicationStatus] Updating application ${id} to status: ${status}`);
        const updated = await Scholarship.updateScholarshipStatus(id, status);
        if (!updated) {
            console.log(`[updateApplicationStatus] Application not found: ${id}`);
            return res.status(404).json({ success: false, error: 'Application not found.' });
        }
        // If approved, create user account
        if (status === 'Approved') {
            // Fetch application to get email/name
            const applications = await Scholarship.getAllScholarships();
            const app = applications.find(a => a.id == id);
            if (app) {
                // Check if user already exists
                const existingUser = await userModel.getUserByEmail(app.email);
                if (!existingUser) {
                    const password = Math.random().toString(36).slice(-8);
                    const hashedPassword = await bcrypt.hash(password, 10);
                    await userModel.createUser({ name: app.fullName, email: app.email, password: hashedPassword, role: 'user', status: 'active' });
                    // Optionally send email with login details
                    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                        try {
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.EMAIL_USER,
                                    pass: process.env.EMAIL_PASS,
                                },
                            });
                            const mailOptions = {
                                from: process.env.EMAIL_USER,
                                to: app.email,
                                subject: 'ALIF Foundation Login Details',
                                text: `Dear ${app.fullName},\n\nYour scholarship has been approved!\nLogin Email: ${app.email}\nPassword: ${password}\n\nPlease login and change your password.\n\nBest regards,\nALIF Foundation`,
                            };
                            await transporter.sendMail(mailOptions);
                            console.log(`[updateApplicationStatus] Login email sent to: ${app.email}`);
                        } catch (mailErr) {
                            console.warn(`[updateApplicationStatus] Failed to send email: ${mailErr.message}`);
                        }
                    }
                }
            }
        }
        // If declined, mark user as inactive if exists
        if (status === 'Declined') {
            const applications = await Scholarship.getAllScholarships();
            const app = applications.find(a => a.id == id);
            if (app) {
                const user = await userModel.getUserByEmail(app.email);
                if (user) {
                    await userModel.updateUserStatus(user.id, 'inactive');
                }
            }
        }
        console.log(`[updateApplicationStatus] Application ${id} updated to ${status}`);
        res.status(200).json({ success: true, message: `Application ${status.toLowerCase()} successfully!` });
    } catch (error) {
        console.error(`[updateApplicationStatus] Error: ${error.message}`);
        res.status(500).json({ success: false, error: 'An error occurred while updating the application status.' });
    }
};