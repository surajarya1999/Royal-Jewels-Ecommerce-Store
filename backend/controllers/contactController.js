// controllers/contactController.js
const Contact = require('../models/Contact');

// @desc    Submit contact message
const submitContactMessage = async (req, res) => {
    try {
        const { name, email, phone, message, subject } = req.body;

        // Validation check
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required fields.'
            });
        }

        const newContact = await Contact.create({
            name,
            email,
            phone: phone || '',
            subject: subject || 'VIP Concierge Inquiry',
            message,
            status: 'Pending',
            replies: []
        });

        res.status(201).json({
            success: true,
            message: 'Inquiry saved successfully',
            contact: newContact
        });
    } catch (error) {
        console.error('❌ Contact Submission Server Error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while saving contact.'
        });
    }
};

// @desc    Get all inquiries
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contacts.length, contacts });
    } catch (error) {
        console.error('❌ Fetch Contacts Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch contacts.' });
    }
};

// @desc    Add reply
const addReplyToContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, sender } = req.body;

        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        contact.replies.push({
            sender: sender || 'Admin',
            message,
            createdAt: new Date()
        });

        if (sender === 'Admin') {
            contact.status = 'Resolved';
        }

        await contact.save();
        res.status(200).json({ success: true, contact });
    } catch (error) {
        console.error('❌ Add Reply Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to send reply' });
    }
};

// @desc    Update status
const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, contact: updated });
    } catch (error) {
        console.error('❌ Update Status Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};

// @desc    Delete contact inquiry
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Contact.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error('❌ Delete Contact Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete inquiry' });
    }
};

module.exports = {
    submitContactMessage,
    getAllContacts,
    addReplyToContact,
    updateContactStatus,
    deleteContact
};