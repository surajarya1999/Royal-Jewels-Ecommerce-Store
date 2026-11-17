// src/components/CelebrityGlam.jsx
import { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, X, Eye } from 'lucide-react';
import { fetchCelebrityLooks } from '../services/api';

const fallbackCelebrityData = [
    {
        id: 1,
        actorName: 'Kriti Sanon looks',
        lookTitle: 'Royal Necklace & Earrings Set',
        subtitle: 'Premium Kundan Replica (Non-Real)',
        image: '/kirti.png',
        hotspots: [
            { top: '58%', left: '42%', name: 'Royal Kundan Statement Choker', price: '₹2,999', code: 'RJ-KUNDAN-01', material: '22K Gold Plated', image: '/kirti.png' },
        ]
    },
    {
        id: 2,
        actorName: 'Ananya Panday looks',
        lookTitle: 'Emerald & Diamond Set',
        subtitle: 'American Diamond Replica (Non-Real)',
        image: 'a.png',
        hotspots: [
            { top: '50%', left: '50%', name: 'Russian Emerald & AD Choker', price: '₹3,499', code: 'RJ-EMERALD-04', material: 'American Diamond (CZ)', image: 'a.png' },
            { top: '65%', left: '45%', name: 'Solitaire AD Haathphool', price: '₹1,599', code: 'RJ-RING-12', material: 'Silver Finish', image: 'a.png' },
        ]
    },
    {
        id: 3,
        actorName: 'Divya looks',
        lookTitle: 'Gold Heritage Jewellery Set',
        subtitle: 'Temple Gold-Plated Replica (Non-Real)',
        image: 'red.png',
        hotspots: [
            { top: '52%', left: '51%', name: 'Antique Temple Haar Replica', price: '₹3,999', code: 'RJ-TEMPLE-88', material: '22K Gold Plated', image: 'red.png' }
        ]
    }
];

const CelebrityGlam = ({ onAddToCart }) => {
    const [activeModal, setActiveModal] = useState(null);
    const [celebLooks, setCelebLooks] = useState(fallbackCelebrityData);

    useEffect(() => {
        const loadLooks = async () => {
            try {
                const response = await fetchCelebrityLooks();
                if (response?.data?.looks && response.data.looks.length > 0) {
                    setCelebLooks(response.data.looks);
                }
            } catch (error) {
                console.error("API error, using curated luxury fallback:", error);
            }
        };
        loadLooks();
    }, []);

    const handleAddModalItemToCart = (spot) => {
        const productItem = {
            id: spot.code || spot.name,
            name: spot.name,
            price: Number(spot.price.replace(/[^\d]/g, '')),
            material: spot.material || '22K Gold Plated',
            image: spot.image || '/cn1.png', // 👈 Exact clicked item ki image pass hogi
            quantity: 1
        };
        if (onAddToCart) {
            onAddToCart(productItem);
        }
        setActiveModal(null);
    };

    return (
        <section id="celebs" className="py-20 bg-gradient-to-b from-[#FAF8F5] via-[#F3EDE2] to-[#FAF8F5] px-4 overflow-hidden relative">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 relative">
                    <div className="inline-flex items-center gap-2 bg-[#2B040B] text-[#D4AF37] border border-[#D4AF37]/40 px-6 py-2 rounded-full text-xs font-semibold tracking-[0.3em] uppercase shadow-md backdrop-blur-md">
                        <Sparkles size={14} className="text-[#D4AF37]" />
                        Red Carpet Icons
                        <Sparkles size={14} className="text-[#D4AF37]" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif text-[#2B040B] font-bold mt-4 tracking-wide leading-tight">
                        As Seen On <span className="italic font-serif text-amber-700">Bollywood</span> Celebrities
                    </h2>

                    <div className="flex items-center justify-center gap-3 my-4">
                        <div className="h-[1px] w-16 bg-[#D4AF37]/60"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-sm"></div>
                        <div className="h-[1px] w-16 bg-[#D4AF37]/60"></div>
                    </div>

                    <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
                        Tap on the glowing golden hotspots over our celebrity icons to discover and acquire their exclusive designer replica pieces instantly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {celebLooks.map((celeb, idx) => (
                        <div
                            key={celeb.id || idx}
                            className="group relative overflow-hidden rounded-3xl shadow-xl border border-[#D4AF37]/30 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(43,4,11,0.15)] flex flex-col justify-between"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-[#2B040B]">
                                <img
                                    src={celeb.image}
                                    alt={celeb.actorName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2B040B]/80 via-transparent to-transparent opacity-60"></div>

                                <div className="absolute top-4 left-4 bg-[#2B040B]/90 text-[#D4AF37] backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-serif font-bold tracking-wider shadow-lg border border-[#D4AF37]/40 flex items-center gap-1.5">
                                    <Sparkles size={12} /> {celeb.actorName}
                                </div>

                                {celeb.hotspots && celeb.hotspots.map((spot, sIdx) => (
                                    <button
                                        key={sIdx}
                                        onClick={() => setActiveModal({ ...spot, image: celeb.image })}
                                        style={{ top: spot.top, left: spot.left }}
                                        className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#D4AF37] border-2 border-white shadow-[0_0_15px_rgba(212,175,55,0.8)] flex items-center justify-center animate-bounce hover:scale-125 transition-transform z-20 group/btn cursor-pointer"
                                        title={spot.name}
                                    >
                                        <span className="w-3 h-3 bg-[#2B040B] rounded-full animate-pulse"></span>
                                    </button>
                                ))}
                            </div>

                            <div
                                onClick={() => celeb.hotspots?.[0] && setActiveModal({ ...celeb.hotspots[0], image: celeb.image })}
                                className="p-6 text-center bg-white border-t border-[#FAF0E6] relative z-10 cursor-pointer"
                            >
                                <h3 className="font-serif font-bold text-lg text-[#2B040B] group-hover:text-amber-800 transition-colors">
                                    {celeb.lookTitle}
                                </h3>
                                <p className="text-[11px] text-[#A36D68] font-semibold mt-1 tracking-wide uppercase">
                                    {celeb.subtitle || '✨ Premium Replica Edition (Non-Real)'}
                                </p>
                                <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] bg-[#2B040B] px-4 py-2 rounded-full shadow-md group-hover:bg-[#4A0A17] transition">
                                    <Eye size={14} /> Tap Hotspots To Shop Look
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {activeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl relative border-2 border-[#D4AF37]/50 transform transition-all scale-100">
                        <button
                            onClick={() => setActiveModal(null)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#2B040B] hover:text-[#D4AF37] transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase bg-[#2B040B] px-3.5 py-1 rounded-full">
                            Celebrity Replica Edition
                        </span>

                        <h4 className="font-serif font-bold text-2xl text-[#2B040B] mt-4">
                            {activeModal.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-mono mt-1">Design Code: {activeModal.code}</p>

                        <div className="my-5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EED9C4] flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Special Price</div>
                                <div className="text-2xl font-serif font-bold text-[#2B040B] mt-0.5">
                                    {activeModal.price}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-md">
                                    ✨ Premium Replica (Non-Real)
                                </span>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => handleAddModalItemToCart(activeModal)}
                                className="w-full bg-[#2B040B] text-[#D4AF37] font-bold py-4 rounded-2xl hover:bg-[#4A0A17] transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-[0_10px_25px_rgba(43,4,11,0.3)] cursor-pointer text-sm tracking-wider uppercase"
                            >
                                <ShoppingBag size={18} /> Add To Bag & Secure Look
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CelebrityGlam;