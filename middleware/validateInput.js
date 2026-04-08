// Simple input validation middleware
module.exports = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === '')) {
      return res.status(400).json({ error: `${field} is required.` });
    }
  }
  next();
};