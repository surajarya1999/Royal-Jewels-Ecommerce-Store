// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { 
    submitContactMessage, 
    getAllContacts, 
    addReplyToContact,
    updateContactStatus,
    deleteContact // <--- Yeh import karna zaroori hai!
} = require('../controllers/contactController');

router.post('/', submitContactMessage);
router.get('/', getAllContacts);
router.post('/:id/reply', addReplyToContact); 
router.put('/:id', updateContactStatus);
router.delete('/:id', deleteContact); // <--- Ab yeh function properly defined hai

module.exports = router;