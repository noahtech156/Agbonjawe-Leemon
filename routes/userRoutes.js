const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');

// Get user by ID (for admin profile view)
router.get('/:id', async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Mock user dashboard endpoint
router.get('/dashboard', (req, res) => {
    // Example response for user dashboard
    res.json({
        status: 'Pending',
        disbursement: null
    });
});

module.exports = router;