// Admin creates user and sends login details after scholarship approval
const nodemailer = require('nodemailer');
exports.adminRegister = async (req, res) => {
    try {
        const { name, email } = req.body;
        // Generate random password
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await require('bcryptjs').hash(password, 10);
        // Create user
        await userModel.createUser({ name, email, password: hashedPassword });
        // Send email with login details
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
                subject: 'ALIF Foundation Login Details',
                text: `Dear ${name},\n\nYour scholarship has been approved!\nLogin Email: ${email}\nPassword: ${password}\n\nPlease login and change your password.\n\nBest regards,\nALIF Foundation`,
            };
            await transporter.sendMail(mailOptions);
        }
        // Return login details for admin display
        res.status(201).json({ 
            message: 'User created and login sent.',
            login: { email, password }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user/send login.' });
    }
};
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (add name if available, else use email as name)
        const name = req.body.name || email;
        const newUser = { name, email, password: hashedPassword };
        await userModel.createUser(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};

exports.verify = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.user.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        res.status(200).json({ 
            success: true,
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during verification' });
    }
};
