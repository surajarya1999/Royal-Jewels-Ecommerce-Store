// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrderRecord, updateOrderStatus } = require('../controllers/orderController');
const Order = require('../models/Order'); // Agar order model yahan required hai

// 1. Save new order after payment
router.post('/save-order', createOrderRecord);

// 2. Get all orders for Admin & Customer History
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
});

// 3. Update order status (Processing -> Shipped -> Delivered)
router.put('/:id/status', updateOrderStatus);

module.exports = router;