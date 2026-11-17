// src/pages/CollectionsPage.jsx
import { useState } from 'react';
import { ArrowUpRight, Sparkles, X, ShoppingBag, ZoomIn, Check } from 'lucide-react';

const collections = [
    { id: 'layered-chains', title: 'Royal Kundan Choker – Gold Plated', material: '22K Gold Plated', price: 2999, style: 'An elegant heritage-inspired kundan choker featuring AAA+ polki stones and delicate pearl drops', image: '/cn1.png' },
    { id: 'cocktail-jewellery', title: 'American Diamond Solitaire Ring', material: 'American Diamond (CZ)', price: 1499, style: 'A timeless solitaire ring featuring a brilliant round-cut CZ stone set in anti-tarnish silver finish', image: '/cr1.png' },
    { id: 'ear-cuffs', title: 'Chandelier AD Earrings – Gold Finish', material: '22K Gold Plated', price: 1899, style: 'Elegant floral chandelier earrings featuring sparkling American diamond stones.', image: '/ce1.png' },
    { id: 'bracelets', title: 'AD Tennis Bracelet – Rose Gold', material: 'Rose Gold Plated', price: 2499, style: 'A sophisticated tennis bracelet featuring a continuous row of brilliant CZ diamonds', image: '/cb1.png' },
    { id: 'anklets', title: 'Designer AD Anklet – Silver Polish', material: 'Silver Finish', price: 1299, style: 'Fine anti-tarnish chains with subtle American diamond shimmer', image: '/ca1.png' },
    { id: 'bangles', title: 'Royal Polki Kada Bangles (Set)', material: '22K Gold Plated', price: 3499, style: 'A luxurious set of intricately designed kadas featuring traditional floral motifs', image: '/cb.png' },
    { id: 'pendants', title: 'Heart-Shaped CZ Pendant – Rose Gold', material: 'Rose Gold Plated', price: 1599, style: 'A romantic heart-shaped pendant with fine micro-crystals', image: '/cp1.png' },
    { id: 'bridal', title: 'Bridal Kundan & Polki Grand Set', material: '22K Gold Plated', price: 6999, style: 'Modern bridal replica set including choker, long haar, earrings & maang tikka', image: '/cbridal.png' },
    { id: 'nosepins', title: 'AD Nath / Nose Pin – Silver Polish', material: 'Silver Finish', price: 899, style: 'Minimal and elegant traditional nose jewellery with AAA+ CZ stones', image: '/cnp1.png' },
    { id: 'maangtikka', title: 'Traditional Gold-Plated Maang Tikka', material: '22K Gold Plated', price: 1199, style: 'An intricate floral kundan maang tikka with pearl hangings', image: '/ct1.png' },
    { id: 'body-jewellery', title: 'Kundan Waist Chain (Kamarband)', material: '22K Gold Plated', price: 4299, style: 'Fashion-forward traditional kamarband with premium kundan polish', image: '/ck1.png' },
    { id: 'jewellery-sets', title: 'Ad-Diamond Luxury Partywear Set', material: 'Rose Gold Plated', price: 4999, style: 'Layered necklace, drop earrings, ring and bracelet matching combo', image: '/cs1.png' },
    { id: 'intimate-jewellery', title: 'Gold-Plated Body Chain Accessory', material: '22K Gold Plated', price: 2199, style: 'A delicate gold intimate body chain featuring floral crystal centrepieces', image: '/c.png' },
    { id: 'jewellery-sets-2', title: 'AD Leaf Ear Cuff – Single Piece', material: 'American Diamond (CZ)', price: 1299, style: 'Elegant leaf-inspired ear cuff featuring marquise-cut sparkling stones', image: '/cc1.png' },
    { id: 'brooches', title: 'Traditional Jhumka Earrings – Gold Finish', material: '22K Gold Plated', price: 1999, style: 'Intricate filigree work, ruby accent stones and delicate pearl drops.', image: '/cj1.png' },
];

const filters = ['All', '22K Gold Plated', 'American Diamond (CZ)', 'Rose Gold Plated', 'Silver Finish'];

export default function CollectionsPage({ onAddToCart }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [addedCartId, setAddedCartId] = useState(null);

    const visibleCollections = activeFilter === 'All'
        ? collections
        : collections.filter(item => item.material === activeFilter);

    const handleAddToCartClick = (item) => {
        const productItem = {
            id: item.id || item.title,
            name: item.title,
            price: Number(item.price || 1999),
            image: item.image,
            material: item.material,
            quantity: 1
        };

        if (onAddToCart) {
            onAddToCart(productItem);
        }

        setAddedCartId(item.id);
        setTimeout(() => setAddedCartId(null), 2000);
    };

    return (
        <main className="min-h-screen bg-[#FCF8F6] text-[#352729] relative">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#F7E7E5] via-[#FFF9F6] to-[#EED9D4] px-4 sm:px-6 py-16 sm:py-24 text-center">
                <div className="mx-auto max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#A36D68]">
                        <Sparkles size={14} /> ROYAL JEWELS PREMIUM REPLICA EDIT
                    </span>

                    <h1 className="mt-4 font-serif text-3xl sm:text-5xl lg:text-7xl leading-tight">
                        Royal Craftsmanship, <span className="italic text-[#B37B75]">Accessible Luxury.</span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm leading-6 sm:leading-7 text-[#76666A]">
                        Exquisite 22K gold-plated, American diamond, and kundan-inspired designer fashion jewellery crafted for every celebration.
                    </p>
                </div>
            </section>

            {/* Collections */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="mb-8 flex flex-col justify-between gap-4 sm:gap-5 md:flex-row md:items-end">
                    <div>
                        <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em] text-[#B37B75]">
                            Discover your signature
                        </span>
                        <h2 className="mt-1 sm:mt-2 font-serif text-2xl sm:text-4xl">
                            Royal Collections
                        </h2>
                    </div>

                    {/* Material Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar w-full md:w-auto">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`shrink-0 rounded-full border px-4 py-2 text-xs transition cursor-pointer ${activeFilter === filter
                                    ? 'border-[#9E6D68] bg-[#9E6D68] text-white shadow-sm'
                                    : 'border-[#E8D7D3] bg-white text-[#6D5557] hover:border-[#9E6D68]'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 xl:gap-7">

                    {visibleCollections.map(item => (
                        <article
                            key={item.id}
                            className="group overflow-hidden rounded-2xl border border-[#F0E4E0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                        >
                            <div>
                                <div
                                    onClick={() => setSelectedItem(item)}
                                    className="relative aspect-[4/4.5] overflow-hidden bg-[#F4ECE8] cursor-pointer"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        loading="lazy"
                                        onError={e => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <span className="absolute left-3 sm:left-4 top-3 sm:top-4 rounded-full bg-white/90 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-[#8B615C] z-10 shadow-xs">
                                        {item.material}
                                    </span>

                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-medium text-xs tracking-wider uppercase z-10">
                                        <ZoomIn size={18} /> Click to Zoom
                                    </div>

                                    <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-[#815A57] shadow-md z-10">
                                        <ArrowUpRight size={17} />
                                    </span>
                                </div>

                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#B37B75]">
                                        <span>ROYAL JEWELS</span>
                                        <span className="font-bold text-[#352729]">₹{item.price.toLocaleString('en-IN')}</span>
                                    </div>

                                    <h3
                                        onClick={() => setSelectedItem(item)}
                                        className="mt-2 font-serif text-lg sm:text-xl text-[#352729] cursor-pointer hover:text-[#9E6D68] transition line-clamp-1"
                                    >
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-xs text-[#8B7C7C] line-clamp-2">
                                        {item.style}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 sm:px-5 sm:pb-5 sm:pt-0">
                                <button
                                    type="button"
                                    onClick={() => handleAddToCartClick(item)}
                                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${addedCartId === item.id
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-[#352729] text-[#F7E7E5] hover:bg-[#523C3F]'
                                        }`}
                                >
                                    {addedCartId === item.id ? (
                                        <>Added to Cart <Check size={15} /></>
                                    ) : (
                                        <>Add to Cart <ShoppingBag size={15} /></>
                                    )}
                                </button>
                            </div>
                        </article>
                    ))}

                </div>
            </section>

            {/* FULLSCREEN ZOOM MODAL */}
            {selectedItem && (
                <div
                    onClick={() => setSelectedItem(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl flex flex-col md:flex-row relative border border-[#EED9D4] animate-in fade-in zoom-in duration-200"
                    >
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/90 hover:bg-gray-100 p-2 sm:p-2.5 rounded-full shadow-md text-gray-700 transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="md:w-1/2 bg-[#F4ECE8] flex items-center justify-center p-6 relative min-h-[260px] sm:min-h-[350px] md:min-h-[450px]">
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.title}
                                className="max-h-[300px] sm:max-h-[400px] w-full object-contain drop-shadow-xl hover:scale-115 transition-transform duration-300"
                            />
                            <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[9px] sm:text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest">
                                ROYAL JEWELS • High-Res Zoom
                            </span>
                        </div>

                        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <span className="bg-[#F7E7E5] text-[#8B615C] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {selectedItem.material}
                                </span>

                                <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#352729] leading-snug">
                                    {selectedItem.title}
                                </h2>

                                <div className="text-xl sm:text-2xl font-bold font-serif text-[#A36D68]">
                                    ₹{selectedItem.price.toLocaleString('en-IN')}
                                </div>

                                <p className="text-xs sm:text-sm text-[#76666A] leading-relaxed pt-2 border-t border-gray-100">
                                    {selectedItem.style}
                                </p>

                                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EED9D4] text-[11px] text-[#6D5557] space-y-1">
                                    <p>✨ Premium Micro Gold-Plated & Skin-Friendly Alloy Base</p>
                                    <p>🛡️ Free Express Shipping & 7-Day Easy Replacement Warranty</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleAddToCartClick(selectedItem)}
                                    className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${addedCartId === selectedItem.id
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-[#352729] text-[#F7E7E5] hover:bg-[#523C3F]'
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

        </main>
    );
}