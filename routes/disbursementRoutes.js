const express = require('express');
const { createDisbursement, getUserDisbursements, getAllDisbursements, sendAppreciationToAll } = require('../controllers/disbursementController');
const Disbursement = require('../models/disbursementModel');
const requireAuth = require('../middleware/requireAuth');
const validateInput = require('../middleware/validateInput');
const router = express.Router();

// User: create disbursement
router.post('/', requireAuth, validateInput(['amount', 'details']), createDisbursement);

// User: get own disbursements
router.get('/user', requireAuth, getUserDisbursements);

// Admin: get all disbursements (order matters - must come after /user)
router.get('/all', requireAuth, getAllDisbursements);

// Admin: update disbursement commentary
router.put('/:id/commentary', requireAuth, async (req, res) => {
    try {
        const { received, notReceived, time, appreciation } = req.body;
        const updated = await Disbursement.updateCommentary(req.params.id, { received, notReceived, time, appreciation });
        if (!updated) return res.status(404).json({ error: 'Disbursement not found' });
        res.json({ message: 'Commentary updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update commentary' });
    }
});

// Appreciation endpoint
router.post('/appreciation', sendAppreciationToAll);

// GET /api/disbursements (all disbursements, for admin dashboard compatibility)
router.get('/', requireAuth, getAllDisbursements);

module.exports = router;
