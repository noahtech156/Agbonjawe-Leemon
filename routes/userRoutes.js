const express = require('express');
const router = express.Router();

// Mock user dashboard endpoint
router.get('/dashboard', (req, res) => {
    // Example response for user dashboard
    res.json({
        status: 'Pending',
        disbursement: null
    });
});

module.exports = router;