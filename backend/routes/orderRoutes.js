// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrderRecord, updateOrderStatus } = require('../controllers/orderController');
const Order = require('../models/Order');

// 1. Save new order after payment
router.post('/save-order', createOrderRecord);

// 2. Get orders (Customer ke liye email-filtered, Admin ke liye all orders)
router.get('/', async (req, res) => {
    try {
        const { email, userId } = req.query;
        let filter = {};

        // Agar customer apni email ya userId bhej raha hai toh sirf usi ke orders fetch karein
        if (email || userId) {
            const orConditions = [];
            if (email) {
                const cleanEmail = email.trim();
                // Case-insensitive exact match on both 'email' and 'userEmail'
                const emailRegex = new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
                orConditions.push({ email: emailRegex }, { userEmail: emailRegex });
            }
            if (userId) {
                orConditions.push({ userId: userId.trim() });
            }
            filter = { $or: orConditions };
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
});

// 3. Update order status (Processing -> Shipped -> Delivered)
router.put('/:id/status', updateOrderStatus);

module.exports = router;