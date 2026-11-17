// src/controllers/orderController.js
const Order = require('../models/Order');

// 1. Create & Save New Order Record
exports.createOrderRecord = async (req, res) => {
    try {
        const { fullName, email, phone, address, city, pincode, paymentId, orderId, items, amount } = req.body;

        const newOrder = new Order({
            fullName,
            email,
            phone,
            address,
            city,
            pincode,
            paymentId,
            orderId,
            items,
            amount,
            status: 'Processing',
            orderStatus: 'Processing'
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order successfully saved to database',
            order: newOrder
        });
    } catch (error) {
        console.error("🔴 Order Saving Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 2. Update Order Status (Processing -> Shipped -> Delivered)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const updatedOrder = await Order.findOneAndUpdate(
            { 
                $or: [
                    { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }, 
                    { orderId: orderId }
                ] 
            },
            { orderStatus: status, status: status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ 
            success: true, 
            message: 'Order status updated successfully', 
            order: updatedOrder 
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while updating status' 
        });
    }
};