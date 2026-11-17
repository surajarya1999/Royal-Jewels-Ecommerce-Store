const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

// Database Connection
connectDB();

// Allowed Origins (Localhost + Live Vercel Frontend)
const allowedOrigins = [
    'https://royal-jewels-ecommerce-store.vercel.app',
    'http://localhost:3000',
    process.env.FRONTEND_URL // Vercel Environment Variable mein apna live frontend link dalein
].filter(Boolean);

// Middlewares
app.use(express.json());
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like Postman/mobile apps) or matching allowedOrigins / any .vercel.app preview
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    })
);

// API Endpoints
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/celebrities', require('./routes/celebrityRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiChatRoutes'));

app.get('/', (req, res) => {
    res.send('👑 Luxury Jewelry MERN Backend Engine is Active!');
});

// Local development ke liye listen chalayein, Vercel production mein module.exports use hoga
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;