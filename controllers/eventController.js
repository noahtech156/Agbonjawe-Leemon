const pool = require('../config/database');

// Create Event
exports.createEvent = async (req, res) => {
    const { name, date, description, location, image_url } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO events (name, date, description, location, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, date, description, location, image_url]
        );
        res.status(201).json({ id: result.insertId, message: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await pool.query('SELECT * FROM events');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// Get Single Event
exports.getEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
        if (events.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(events[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};

// Update Event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, date, description, location, image_url } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE events SET name = ?, date = ?, description = ?, location = ?, image_url = ? WHERE id = ?',
            [name, date, description, location, image_url, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
};