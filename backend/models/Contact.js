// models/Contact.js
const mongoose = require('mongoose');

// Single reply object ka schema
const replySchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'Admin'
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Main Contact Inquiry Schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    subject: {
        type: String,
        default: 'VIP Concierge Inquiry'
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Resolved'],
        default: 'Pending'
    },
    replies: [replySchema] // <--- Dynamic live chat replies array
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);