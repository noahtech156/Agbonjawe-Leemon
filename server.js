const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const postRoutes = require('./routes/postRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/user', userRoutes);
app.use('/api/events', eventRoutes);

// Error Handler
app.use(errorHandler);

// Test MySQL connection
pool.getConnection()
    .then(() => console.log('Connected to MySQL database'))
    .catch(err => console.error('MySQL connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});