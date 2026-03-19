const express = require('express');
const { createEvent, getAllEvents, getEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Event Routes
router.post('/', requireAuth, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEvent);
router.put('/:id', requireAuth, updateEvent);
router.delete('/:id', requireAuth, deleteEvent);

module.exports = router;