// Update disbursement commentary (received, not received, time, appreciation)
const Disbursement = require('../models/disbursementModel');
router.put('/:id/commentary', async (req, res) => {
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
const { sendAppreciationToAll } = require('../controllers/disbursementController');
router.post('/appreciation', sendAppreciationToAll);
const express = require('express');
const { createDisbursement, getUserDisbursements, getAllDisbursements } = require('../controllers/disbursementController');
const requireAuth = require('../middleware/requireAuth');
const validateInput = require('../middleware/validateInput');
const router = express.Router();

// User: create disbursement
router.post('/', requireAuth, validateInput(['amount', 'details']), createDisbursement);
// User: get own disbursements
router.get('/user', requireAuth, getUserDisbursements);
// Admin: get all disbursements
router.get('/all', requireAuth, getAllDisbursements); // Add admin check in controller or middleware

module.exports = router;
