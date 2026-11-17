// backend/routes/aiChatRoutes.js
const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Product = require('../models/Product');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let cachedCatalog = null;
let lastCacheTime = 0;

const getCatalogContext = async () => {
    const now = Date.now();
    if (cachedCatalog && (now - lastCacheTime < 5 * 60 * 1000)) {
        return cachedCatalog;
    }

    const collectionsPageItems = `
Collections Page Featured Items:
- Royal Kundan Choker – Gold Plated (22K Gold Plated): ₹2,999 — Elegant heritage kundan choker featuring AAA+ polki stones & pearl drops.
- American Diamond Solitaire Ring (American Diamond CZ): ₹1,499 — Timeless solitaire ring in anti-tarnish silver finish.
- Chandelier AD Earrings – Gold Finish (22K Gold Plated): ₹1,899 — Floral chandelier earrings with sparkling American diamonds.
- AD Tennis Bracelet – Rose Gold (Rose Gold Plated): ₹2,499 — Continuous brilliant CZ diamond tennis bracelet.
- Designer AD Anklet – Silver Polish (Silver Finish): ₹1,299 — Fine anti-tarnish chains with subtle AD shimmer.
- Royal Polki Kada Bangles Set (22K Gold Plated): ₹3,499 — Luxurious set of traditional floral motif kadas.
- Heart-Shaped CZ Pendant – Rose Gold (Rose Gold Plated): ₹1,599 — Romantic heart-shaped pendant with micro-crystals.
- Bridal Kundan & Polki Grand Set (22K Gold Plated): ₹6,999 — Modern bridal replica set including choker, long haar, earrings & maang tikka.
- AD Nath / Nose Pin – Silver Polish (Silver Finish): ₹899 — Minimal traditional nose jewellery with AAA+ CZ stones.
- Traditional Gold-Plated Maang Tikka (22K Gold Plated): ₹1,199 — Intricate floral kundan maang tikka with pearl hangings.
- Kundan Waist Chain Kamarband (22K Gold Plated): ₹4,299 — Fashion-forward traditional kamarband with premium kundan polish.
- Ad-Diamond Luxury Partywear Set (Rose Gold Plated): ₹4,999 — Layered necklace, drop earrings, ring and bracelet combo.
- Gold-Plated Body Chain Accessory (22K Gold Plated): ₹2,199 — Delicate intimate body chain featuring floral crystal centerpieces.
- AD Leaf Ear Cuff – Single Piece (American Diamond CZ): ₹1,299 — Leaf-inspired ear cuff with marquise-cut stones.
- Traditional Jhumka Earrings – Gold Finish (22K Gold Plated): ₹1,999 — Filigree work, ruby accents and pearl drops.
    `;

    try {
        const products = await Product.find().select('name category price description').limit(25).lean();
        let dynamicProductsText = "";

        if (products && products.length > 0) {
            dynamicProductsText = "\nLive Database Products:\n" + products
                .map(p => `- ${p.name} (${p.category || 'Jewellery'}): ₹${p.price} — ${p.description || '22K Gold-Plated'}`)
                .join('\n');
        }

        cachedCatalog = collectionsPageItems + "\n" + dynamicProductsText;
        lastCacheTime = now;
    } catch (e) {
        cachedCatalog = collectionsPageItems;
    }
    return cachedCatalog;
};

// Smart Local Fallback (Agar Gemini 503 High Demand error de)
const getLocalSmartReply = (msg) => {
    const text = msg.toLowerCase();
    if (text.includes('bridal') || text.includes('wedding') || text.includes('shaadi') || text.includes('kundan')) {
        return "Bridal ke liye hamare paas 'Bridal Kundan & Polki Grand Set' (₹6,999) aur 'Royal Kundan Choker' (₹2,999) available hain. Ye 22K Gold-Plated aur Anti-Tarnish hain! 👑";
    }
    if (text.includes('ring') || text.includes('solitaire')) {
        return "Hamare paas 'American Diamond Solitaire Ring' (₹1,499) anti-tarnish silver finish mein available hai ✨.";
    }
    if (text.includes('earring') || text.includes('jhumka') || text.includes('chandeliers')) {
        return "Earrings mein hamare paas 'Chandelier AD Earrings' (₹1,899) aur 'Traditional Jhumka Earrings' (₹1,999) best sellers hain!";
    }
    if (text.includes('price') || text.includes('range') || text.includes('kitne')) {
        return "Hamari jewellery range ₹899 (Nose pins) se shuru hoti hai aur grand bridal sets ₹6,999 tak ke hain. Sabhi 22K Gold-Plated aur Anti-Tarnish hain ✨.";
    }
    if (text.includes('shipping') || text.includes('delivery')) {
        return "Hum India ke sabhi locations par **Free Insured Shipping** provide karte hain (Orders above ₹999). Delivery 3-5 working days mein ho jaati hai 🚚.";
    }
    if (text.includes('exchange') || text.includes('return')) {
        return "Hamari **7-day Easy Exchange** policy hai 🔄.";
    }
    return "Namaste! 👑 Royal Jewels mein aapka swagat hai. Hamare paas Kundan, Polki, AD Sets aur Bangles available hain—aap upar Collections section mein sabhi designs dekh sakte hain!";
};

router.post('/chat', async (req, res) => {
    try {
        const { message = '', history = [] } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.json({ success: true, reply: getLocalSmartReply(message) });
        }

        const productCatalogText = await getCatalogContext();

        const systemInstruction = `You are "Royal Concierge", official AI Jewellery Stylist for "Royal Jewels" luxury store in India.
Tone: Warm, polite, royal, helpful. Reply in Hinglish/English.
Store Policies: 22K Gold-Plated, Anti-Tarnish, Free shipping above ₹999, 7-day exchange.
Catalog & Collections:
${productCatalogText}
Rules: Recommend items with exact prices from the catalog based on user queries. Use bullet points.`;

        const contents = history.map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        }));

        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                maxOutputTokens: 800,
                temperature: 0.7
            }
        });

        const reply = response.text || getLocalSmartReply(message);
        return res.json({ success: true, reply });

    } catch (error) {
        console.error('Gemini API 503 / High Demand Fallback Triggered:', error.message);
        // Server busy hone par bhi user ko error nahi dikhega, instant smart reply jayega
        const { message = '' } = req.body;
        return res.json({
            success: true,
            reply: getLocalSmartReply(message)
        });
    }
});

module.exports = router;