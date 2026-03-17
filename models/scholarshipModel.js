const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    documents: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);