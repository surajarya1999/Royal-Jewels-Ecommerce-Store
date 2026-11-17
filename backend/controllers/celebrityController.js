const CelebrityLook = require('../models/CelebrityLook');

// Get All Celebrity Looks with Hotspots
exports.getCelebrityLooks = async (req, res) => {
    try {
        const looks = await CelebrityLook.find().populate('hotspots.product');
        res.status(200).json({ success: true, looks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add New Celebrity Lookbook Entry (Admin)
exports.createCelebrityLook = async (req, res) => {
    try {
        const newLook = new CelebrityLook(req.body);
        const savedLook = await newLook.save();
        res.status(201).json({ success: true, look: savedLook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};