// src/components/SearchModal.jsx
import { useState, useEffect } from 'react';
import { Search, X, ShoppingBag, Sparkles, ZoomIn, Check } from 'lucide-react';
import { fetchProducts } from '../services/api';

const staticCollections = [
    { id: 'layered-chains', name: 'Royal Kundan Choker – Gold Plated', category: 'Necklaces', material: '22K Gold Plated', price: 2999, image: '/cn1.png', style: 'An elegant heritage-inspired kundan choker featuring AAA+ polki stones and delicate pearl drops' },
    { id: 'cocktail-jewellery', name: 'American Diamond Solitaire Ring', category: 'Rings', material: 'American Diamond (CZ)', price: 1499, image: '/cr1.png', style: 'A timeless solitaire ring featuring a brilliant round-cut CZ stone set in anti-tarnish silver finish' },
    { id: 'ear-cuffs', name: 'Chandelier AD Earrings – Gold Finish', category: 'Earrings', material: '22K Gold Plated', price: 1899, image: '/ce1.png', style: 'Elegant floral chandelier earrings featuring sparkling American diamond stones.' },
    { id: 'bracelets', name: 'AD Tennis Bracelet – Rose Gold', category: 'Rose Gold Plated', price: 2499, image: '/cb1.png', style: 'A sophisticated tennis bracelet featuring a continuous row of brilliant CZ diamonds' },
    { id: 'anklets', name: 'Designer AD Anklet – Silver Polish', category: 'Silver Finish', price: 1299, image: '/ca1.png', style: 'Fine anti-tarnish chains with subtle American diamond shimmer' },
    { id: 'bangles', name: 'Royal Polki Kada Bangles (Set)', category: 'Bangles', material: '22K Gold Plated', price: 3499, image: '/cb.png', style: 'A luxurious set of intricately designed kadas featuring traditional floral motifs' },
    { id: 'pendants', name: 'Heart-Shaped CZ Pendant – Rose Gold', category: 'Rose Gold Plated', price: 1599, image: '/cp1.png', style: 'A romantic heart-shaped pendant with fine micro-crystals' },
    { id: 'bridal', name: 'Bridal Kundan & Polki Grand Set', category: 'Bridal', material: '22K Gold Plated', price: 6999, image: '/cbridal.png', style: 'Modern bridal replica set including choker, long haar, earrings & maang tikka' },
    { id: 'nosepins', name: 'AD Nath / Nose Pin – Silver Polish', category: 'Silver Finish', price: 899, image: '/cnp1.png', style: 'Minimal and elegant traditional nose jewellery with AAA+ CZ stones' },
    { id: 'maangtikka', name: 'Traditional Gold-Plated Maang Tikka', category: 'Maangtikka', material: '22K Gold Plated', price: 1199, image: '/ct1.png', style: 'An intricate floral kundan maang tikka with pearl hangings' },
    { id: 'body-jewellery', name: 'Kundan Waist Chain (Kamarband)', category: 'Body Jewellery', material: '22K Gold Plated', price: 4299, image: '/ck1.png', style: 'Fashion-forward traditional kamarband with premium kundan polish' },
    { id: 'jewellery-sets', name: 'Ad-Diamond Luxury Partywear Set', category: 'Jewellery Sets', material: 'Rose Gold Plated', price: 4999, image: '/cs1.png', style: 'Layered necklace, drop earrings, ring and bracelet matching combo' },
    { id: 'intimate-jewellery', name: 'Gold-Plated Body Chain Accessory', category: 'Intimate Jewellery', material: '22K Gold Plated', price: 2199, image: '/c.png', style: 'A delicate gold intimate body chain featuring floral crystal centrepieces' },
    { id: 'jewellery-sets-2', name: 'AD Leaf Ear Cuff – Single Piece', category: 'Earrings', material: 'American Diamond (CZ)', price: 1299, image: '/cc1.png', style: 'Elegant leaf-inspired ear cuff featuring marquise-cut sparkling stones' },
    { id: 'brooches', name: 'Traditional Jhumka Earrings – Gold Finish', category: 'Earrings', material: '22K Gold Plated', price: 1999, image: '/cj1.png', style: 'Intricate filigree work, ruby accent stones and delicate pearl drops.' }
];

export default function SearchModal({ isOpen, onClose, onAddToCart }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState(staticCollections);
    const [selectedItem, setSelectedItem] = useState(null);
    const [addedCartId, setAddedCartId] = useState(null);

    // Interactive Zoom States
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
    const [isZoomed, setIsZoomed] = useState(false);

    // Fetch database products when modal opens (Supports Localhost & Live Atlas via api.js)
    useEffect(() => {
        if (isOpen) {
            fetchProducts()
                .then(res => {
                    const response = res.data;
                    const data = response.products || response.data || response;
                    if (Array.isArray(data) && data.length > 0) {
                        const formattedDbProducts = data.map(p => ({
                            id: p._id || p.id || Math.random().toString(),
                            name: p.name || 'Royal Jewellery Piece',
                            category: p.category || 'Jewellery',
                            material: p.metalType || p.material || '22K Gold Plated',
                            price: Number(p.price || 1999),
                            image: p.imageUrl || p.image || '/cn1.png',
                            style: p.description || 'Handcrafted premium fashion & replica jewellery.'
                        }));

                        const combined = [
                            ...staticCollections,
                            ...formattedDbProducts.filter(dp =>
                                !staticCollections.some(sc => sc.name.toLowerCase() === dp.name.toLowerCase())
                            )
                        ];
                        setAllProducts(combined);
                    }
                })
                .catch(err => {
                    console.log('Using static collection catalog for search:', err);
                });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredProducts = searchTerm.trim() === ''
        ? []
        : allProducts.filter(item => {
            const name = (item.name || '').toLowerCase();
            const category = (item.category || '').toLowerCase();
            const material = (item.material || '').toLowerCase();
            const query = searchTerm.toLowerCase();
            return name.includes(query) || category.includes(query) || material.includes(query);
        });

    const handleAddToCartClick = (item) => {
        onAddToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            material: item.material,
            quantity: 1
        });
        setAddedCartId(item.id);
        setTimeout(() => setAddedCartId(null), 2000);
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2.2)'
        });
    };

    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
            const x = Math.max(0, Math.min(100, ((touch.clientX - left) / width) * 100));
            const y = Math.max(0, Math.min(100, ((touch.clientY - top) / height) * 100));
            setIsZoomed(true);
            setZoomStyle({
                transformOrigin: `${x}% ${y}%`,
                transform: 'scale(2.2)'
            });
        }
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
        setZoomStyle({
            transformOrigin: 'center center',
            transform: 'scale(1)'
        });
    };

    const closeModalAndResetZoom = () => {
        setSelectedItem(null);
        handleMouseLeave();
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-10 sm:pt-16 md:pt-20 px-3 sm:px-4 animate-in fade-in duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#2B040B] border border-[#D4AF37] sm:border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-[0_0_50px_rgba(212,175,55,0.2)] relative text-[#FAF8F5] max-h-[88vh] sm:max-h-[85vh] flex flex-col"
            >

                {/* Header */}
                <div className="flex justify-between items-center gap-2 mb-3.5 sm:mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0" />
                        <h3 className="font-serif text-base sm:text-xl font-bold text-[#D4AF37] truncate">
                            Explore Royal Collection
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close Search"
                        className="text-gray-400 hover:text-[#D4AF37] transition cursor-pointer bg-transparent border-none p-1 shrink-0"
                    >
                        <X size={20} className="sm:w-[22px] sm:h-[22px]" />
                    </button>
                </div>

                {/* Input Bar */}
                <div className="relative mb-3">
                    <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search kundan, bridal sets, rings..."
                        className="w-full bg-[#4A0A17] border border-[#D4AF37]/50 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-9 py-2.5 sm:py-3.5 text-xs sm:text-sm text-[#FAF8F5] placeholder:text-xs placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] shadow-inner"
                        autoFocus
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3.5 sm:mb-4 text-xs">
                    <span className="text-[11px] text-gray-400">Popular:</span>
                    {['Necklaces', 'Bridal', 'Gold Plated', 'American Diamond', 'Rings'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setSearchTerm(tag)}
                            className="bg-[#4A0A17] hover:bg-[#D4AF37] hover:text-[#2B040B] text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition duration-200 text-[10px] sm:text-[11px] font-medium cursor-pointer"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Results Container */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 sm:space-y-3 custom-scrollbar">
                    {searchTerm.trim() === '' ? (
                        <div className="text-center py-8 sm:py-10 text-gray-400 text-[11px] sm:text-xs font-light px-2">
                            ✨ Type a design name or material to search instantly across our royal collection.
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className="flex items-center justify-between gap-2.5 sm:gap-3 bg-[#3A060E]/80 border border-[#D4AF37]/20 hover:border-[#D4AF37]/70 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition duration-300 cursor-pointer group"
                            >
                                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                    <div className="relative overflow-hidden rounded-lg sm:rounded-xl border border-[#D4AF37]/30 bg-black/40 shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                            <ZoomIn size={15} />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FAF8F5] group-hover:text-amber-300 transition truncate">
                                            {item.name}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                                            <span className="text-[8px] sm:text-[9px] text-[#D4AF37] uppercase tracking-wider font-semibold bg-[#2B040B] px-1.5 sm:px-2 py-0.5 rounded border border-[#D4AF37]/30">
                                                {item.category}
                                            </span>
                                            <span className="text-[8px] sm:text-[9px] text-gray-300 uppercase tracking-wider truncate">
                                                {item.material}
                                            </span>
                                        </div>
                                        <div className="text-xs font-bold text-amber-300 mt-1">
                                            ₹{item.price.toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCartClick(item);
                                    }}
                                    className={`font-bold text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-md shrink-0 ${addedCartId === item.id
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-[#D4AF37] text-[#2B040B] hover:bg-amber-300'
                                        }`}
                                >
                                    {addedCartId === item.id ? <><Check size={13} /> Added</> : <><ShoppingBag size={13} /> Add</>}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-xs">
                            No pieces matching "<span className="text-[#D4AF37]">{searchTerm}</span>" found in our store.
                        </div>
                    )}
                </div>

            </div>

            {/* INTERACTIVE CURSOR & TOUCH ZOOM MODAL */}
            {selectedItem && (
                <div
                    onClick={closeModalAndResetZoom}
                    className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-3 sm:p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col md:flex-row relative border border-[#EED9D4] text-[#352729]"
                    >
                        <button
                            onClick={closeModalAndResetZoom}
                            aria-label="Close Product Preview"
                            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 bg-white/90 hover:bg-gray-100 p-2 sm:p-2.5 rounded-full shadow-md text-gray-700 transition cursor-pointer"
                        >
                            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>

                        {/* Interactive Zoom Image Area */}
                        <div
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleMouseLeave}
                            onClick={(e) => {
                                if (isZoomed) {
                                    handleMouseLeave();
                                } else {
                                    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                    const x = ((e.clientX - left) / width) * 100;
                                    const y = ((e.clientY - top) / height) * 100;
                                    setIsZoomed(true);
                                    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2.2)' });
                                }
                            }}
                            className="md:w-1/2 bg-[#F4ECE8] flex items-center justify-center p-5 sm:p-6 relative min-h-[230px] sm:min-h-[300px] overflow-hidden cursor-zoom-in select-none touch-none"
                        >
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.name}
                                style={zoomStyle}
                                className="max-h-[220px] sm:max-h-[340px] md:max-h-[380px] w-full object-contain drop-shadow-xl transition-transform duration-150 ease-out"
                            />
                            <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-black/70 text-white text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-widest pointer-events-none shadow-md">
                                🔍 Hover / Tap to Zoom
                            </span>
                        </div>

                        {/* Product Details Area */}
                        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between space-y-4">
                            <div className="space-y-2.5 sm:space-y-3">
                                <span className="inline-block bg-[#F7E7E5] text-[#8B615C] text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                                    {selectedItem.material}
                                </span>

                                <h2 className="font-serif text-lg sm:text-2xl text-[#352729] leading-snug">
                                    {selectedItem.name}
                                </h2>

                                <div className="text-xl sm:text-2xl font-bold font-serif text-[#A36D68]">
                                    ₹{selectedItem.price.toLocaleString('en-IN')}
                                </div>

                                <p className="text-xs sm:text-sm text-[#76666A] leading-relaxed pt-2 border-t border-gray-100">
                                    {selectedItem.style}
                                </p>

                                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EED9D4] text-[10px] sm:text-[11px] text-[#6D5557] space-y-1">
                                    <p>✨ 22K Gold-Plated & 100% Anti-Tarnish Finish</p>
                                    <p>🛡️ Free Express Shipping & 7-Day Easy Replacement Warranty</p>
                                </div>
                            </div>

                            <div className="pt-3 sm:pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => handleAddToCartClick(selectedItem)}
                                    className={`w-full py-3 sm:py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${addedCartId === selectedItem.id
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-[#2B040B] text-[#FAF8F5] hover:bg-[#523C3F]'
                                        }`}
                                >
                                    {addedCartId === selectedItem.id ? (
                                        <>Added to Cart <Check size={16} /></>
                                    ) : (
                                        <><ShoppingBag size={16} /> Add to Cart — ₹{selectedItem.price.toLocaleString('en-IN')}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}