const Razorpay = require('razorpay');

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        // Check if amount is provided
        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is missing in request body",
            });
        }

        // Check if Razorpay keys exist in environment variables
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Razorpay API keys are not configured in backend .env file",
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(Number(amount) * 100), // Amount in paise
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("🔴 Razorpay Backend Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error during order creation",
        });
    }
};