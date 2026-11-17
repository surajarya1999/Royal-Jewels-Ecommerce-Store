// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Necklaces', 'Earrings', 'Rings', 'Bridal', 'necklaces', 'earrings', 'rings', 'bridal'] // 👈 Dono allow kar diye
  },
  price: { type: Number, required: true },
  mrp: { type: Number },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  metalType: { type: String, default: '22K Yellow Gold' },
  karatage: { type: String, default: '22K' },
  isHallmarked: { type: Boolean, default: true },
  stock: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);