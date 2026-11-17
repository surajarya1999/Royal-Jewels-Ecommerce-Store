const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/celebrities', require('./routes/celebrityRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.use('/api/contact', require('./routes/contactRoutes'));
// Server.js ke andar baki app.use('/api/...') ke sath yeh jodein:
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiChatRoutes'));



app.get('/', (req, res) => {
    res.send('👑 Luxury Jewelry MERN Backend Engine is Active!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
