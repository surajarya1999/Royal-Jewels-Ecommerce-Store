// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Admin Login Endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@royaljewels.in';
    const adminPass = process.env.ADMIN_PASSWORD || 'Royal@2026';

    if (email === adminEmail && password === adminPass) {
        return res.json({
            success: true,
            message: 'Admin Authentication Successful',
            token: 'royal_secure_admin_jwt_token_2026'
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid Admin ID or Password. Access Denied.'
    });
});

module.exports = router;