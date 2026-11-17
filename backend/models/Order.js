const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            name: String,
            price: Number,
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingDetails: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    deliveryStatus: {
        type: String,
        enum: ['Order Placed', 'Handcrafting & BIS Hallmarking', 'Dispatched', 'Out for Delivery', 'Delivered'],
        default: 'Order Placed'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);