const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema({
    topPercent: { type: String, required: true },  // e.g. "48%"
    leftPercent: { type: String, required: true }, // e.g. "48%"
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

const celebrityLookSchema = new mongoose.Schema({
    actorName: { type: String, required: true }, // e.g. "Kriti Sanon"
    lookTitle: { type: String, required: true }, // e.g. "Royal Kundan Choker & Pearl Drops"
    actorImageUrl: { type: String, required: true },
    hotspots: [hotspotSchema]
}, { timestamps: true });

module.exports = mongoose.model('CelebrityLook', celebrityLookSchema);