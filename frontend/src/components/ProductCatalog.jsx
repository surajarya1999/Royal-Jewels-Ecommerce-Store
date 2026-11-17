// src/components/ProductCatalog.jsx
import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { Sparkles, Heart, ZoomIn, X, ShoppingBag, Check, ArrowRight, Loader2 } from 'lucide-react';

const ProductCatalog = ({ onAddToCart, onAddToWishlist, selectedCategory = 'All', onNavigateToCollections }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(selectedCategory || 'All');
    const [prevSelectedCategory, setPrevSelectedCategory] = useState(selectedCategory);
    const [wishlistMap, setWishlistMap] = useState({});

    // Zoom Modal States
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [addedCartId, setAddedCartId] = useState(null);

    // Interactive Deep Zoom States (Desktop Cursor + Mobile Touch)
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
    const [isZoomed, setIsZoomed] = useState(false);

    // Sync activeTab when external selectedCategory prop changes
    if (selectedCategory && selectedCategory !== prevSelectedCategory) {
        setPrevSelectedCategory(selectedCategory);
        setActiveTab(selectedCategory);
    }

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                const response = await fetchProducts();
                const data = response.data.products || response.data || [];
                if (isMounted) setProducts(data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadProducts();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleWishlistToggle = (product) => {
        setWishlistMap((prev) => ({
            ...prev,
            [product._id]: !prev[product._id]
        }));

        if (onAddToWishlist) {
            onAddToWishlist(product);
        }
    };

    const handleAddToCartClick = (product) => {
        if (onAddToCart) {
            onAddToCart(product);
        }
        setAddedCartId(product._id);
        setTimeout(() => setAddedCartId(null), 2000);
    };

    // Interactive Zoom Handlers (Desktop + Mobile Touch)
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

    const handleResetZoom = () => {
        setIsZoomed(false);
        setZoomStyle({
            transformOrigin: 'center center',
            transform: 'scale(1)'
        });
    };

    const closeModalAndResetZoom = () => {
        setSelectedProduct(null);
        handleResetZoom();
    };

    const filteredProducts = products.filter((product) => {
        if (!activeTab || activeTab === 'All') return true;
        return product.category?.toLowerCase() === activeTab.toLowerCase();
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-[#2B040B]">
                <Loader2 className="animate-spin mb-3 text-[#D4AF37]" size={32} />
                <p className="font-serif text-sm sm:text-lg text-[#2B040B]">
                    ✨ Fetching ROYAL JEWELS Collection...
                </p>
            </div>
        );
    }

    return (
        <section className="py-8 sm:py-12 px-3.5 sm:px-6 max-w-7xl mx-auto relative font-sans">
            <div className="text-center mb-7 sm:mb-10">
                <span className="text-[#9E6D68] font-semibold text-[10px] sm:text-xs tracking-widest uppercase inline-flex items-center justify-center gap-1.5">
                    <Sparkles size={13} className="text-[#D4AF37]" /> ROYAL JEWELS Curated Masterpieces <Sparkles size={13} className="text-[#D4AF37]" />
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2B040B] mt-2 leading-tight">
                    Royal Signature Collection
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2 px-1">
                    Handcrafted premium fashion &amp; replica jewellery synchronized from live catalog. Tap any item to zoom-inspect.
                </p>

                {/* Category Pills & More Collections Button */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
                    {['All', 'Necklaces', 'Earrings', 'Rings', 'Bridal'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeTab.toLowerCase() === cat.toLowerCase()
                                ? 'bg-[#2B040B] text-[#D4AF37] shadow-md border border-[#D4AF37]'
                                : 'bg-white text-gray-700 border border-[#EED9C4] hover:border-[#D4AF37]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            if (onNavigateToCollections) {
                                onNavigateToCollections();
                            }
                        }}
                        className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#2B040B] to-[#4A0A17] text-[#D4AF37] border border-[#D4AF37]/60 shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5"
                    >
                        <span>More Collections</span>
                        <ArrowRight size={13} />
                    </button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-2xl border border-dashed border-[#D4AF37]/50 max-w-xl mx-auto my-6">
                    <p className="text-gray-600 text-xs sm:text-sm font-serif">
                        No exquisite pieces found under <span className="text-[#9E6D68] font-bold">&ldquo;{activeTab}&rdquo;</span> category yet.
                    </p>
                    <button
                        onClick={() => setActiveTab('All')}
                        className="mt-4 bg-[#2B040B] text-[#D4AF37] text-xs font-bold px-5 sm:px-6 py-2.5 rounded-xl uppercase tracking-wider hover:bg-[#4A0A17] transition cursor-pointer"
                    >
                        View All Collections
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#EED9C4] hover:shadow-xl transition duration-300 flex flex-col justify-between group relative"
                        >
                            <div>
                                <div
                                    onClick={() => {
                                        handleResetZoom();
                                        setSelectedProduct(product);
                                    }}
                                    className="h-56 sm:h-64 md:h-72 w-full overflow-hidden bg-gray-100 relative cursor-pointer"
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 font-medium text-xs tracking-wider uppercase z-10">
                                        <ZoomIn size={18} /> Tap to Deep Zoom
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWishlistToggle(product);
                                        }}
                                        className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-red-500 hover:scale-110 active:scale-95 transition cursor-pointer border border-[#D4AF37]/30 z-20"
                                        title="Save to Wishlist"
                                        aria-label="Save to Wishlist"
                                    >
                                        <Heart
                                            size={16}
                                            className={wishlistMap[product._id] ? "fill-red-600 text-red-600" : "text-gray-700"}
                                        />
                                    </button>

                                    <span className="absolute top-3 right-3 bg-[#2B040B]/85 backdrop-blur-sm text-[#D4AF37] text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-[#D4AF37]/40 z-20 max-w-[140px] truncate">
                                        {product.metalType || '22K Gold Plated'}
                                    </span>
                                </div>

                                <div className="p-4 sm:p-5">
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#9E6D68] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EED9C4]">
                                        Premium Replica Edition
                                    </span>
                                    <h3
                                        onClick={() => {
                                            handleResetZoom();
                                            setSelectedProduct(product);
                                        }}
                                        className="font-serif font-bold text-[#2B040B] text-base sm:text-lg mt-2.5 sm:mt-3 line-clamp-1 cursor-pointer hover:text-[#9E6D68] transition"
                                    >
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-light leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 sm:p-5 pt-2.5 flex justify-between items-center border-t border-[#FAF8F5]">
                                <div>
                                    <span className="text-[9px] sm:text-[10px] text-gray-400 block font-sans uppercase tracking-wider">
                                        Price
                                    </span>
                                    <span className="font-serif font-bold text-[#2B040B] text-base sm:text-lg">
                                        ₹{Number(product.price).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleAddToCartClick(product)}
                                    className={`text-xs font-serif font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 ${addedCartId === product._id
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-[#2B040B] text-[#D4AF37] hover:bg-[#4A0A17]'
                                        }`}
                                >
                                    {addedCartId === product._id ? (
                                        <>Added <Check size={14} /></>
                                    ) : (
                                        <>Buy Now</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FULLSCREEN INTERACTIVE CURSOR & MOBILE TOUCH DEEP ZOOM MODAL */}
            {selectedProduct && (
                <div
                    onClick={closeModalAndResetZoom}
                    className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative border border-[#EED9C4] animate-in fade-in zoom-in duration-200"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModalAndResetZoom}
                            aria-label="Close Product Modal"
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/90 hover:bg-gray-100 p-2 sm:p-2.5 rounded-full shadow-md text-gray-700 transition cursor-pointer"
                        >
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </button>

                        {/* Modal Left: Interactive Deep Zoom Image (Desktop Hover + Mobile Tap/Drag) */}
                        <div
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleResetZoom}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleResetZoom}
                            onClick={(e) => {
                                if (isZoomed) {
                                    handleResetZoom();
                                } else {
                                    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                    const x = ((e.clientX - left) / width) * 100;
                                    const y = ((e.clientY - top) / height) * 100;
                                    setIsZoomed(true);
                                    setZoomStyle({
                                        transformOrigin: `${x}% ${y}%`,
                                        transform: 'scale(2.2)'
                                    });
                                }
                            }}
                            className="md:w-1/2 bg-[#FAF8F5] flex items-center justify-center p-5 sm:p-6 relative min-h-[250px] sm:min-h-[340px] md:min-h-[450px] overflow-hidden cursor-zoom-in select-none touch-none"
                        >
                            <img
                                src={selectedProduct.imageUrl}
                                alt={selectedProduct.name}
                                style={zoomStyle}
                                className="max-h-[230px] sm:max-h-[340px] md:max-h-[400px] w-full object-contain drop-shadow-xl transition-transform duration-150 ease-out"
                            />
                            <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-black/70 text-white text-[9px] sm:text-[10px] px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-widest pointer-events-none shadow-md">
                                🔍 {isZoomed ? 'Tap to Reset Zoom' : 'Move Cursor / Tap & Drag to Zoom'}
                            </span>
                        </div>

                        {/* Modal Right: Details & Add to Cart */}
                        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between space-y-4">
                            <div className="space-y-2.5 sm:space-y-3">
                                <span className="inline-block bg-[#FAF8F5] text-[#9E6D68] border border-[#EED9C4] text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                                    {selectedProduct.metalType || '22K Gold Plated / Replica'}
                                </span>

                                <h2 className="font-serif text-xl sm:text-3xl text-[#2B040B] leading-snug">
                                    {selectedProduct.name}
                                </h2>

                                <div className="text-xl sm:text-2xl font-bold font-serif text-[#2B040B]">
                                    ₹{Number(selectedProduct.price || 0).toLocaleString('en-IN')}
                                </div>

                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100 font-light">
                                    {selectedProduct.description}
                                </p>

                                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EED9C4] text-[10px] sm:text-[11px] text-[#2B040B] space-y-1">
                                    <p>✨ Premium Anti-Tarnish Micro Gold-Plated &amp; Skin-Friendly Alloy Base</p>
                                    <p>🛡️ Free Express Shipping &amp; 7-Day Easy Replacement Warranty</p>
                                </div>
                            </div>

                            <div className="pt-3 sm:pt-4 border-t border-gray-100 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleAddToCartClick(selectedProduct)}
                                    className={`flex-1 py-3 sm:py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-[0.99] ${addedCartId === selectedProduct._id
                                        ? 'bg-emerald-700 text-white'
                                        : 'bg-[#2B040B] text-[#D4AF37] hover:bg-[#4A0A17]'
                                        }`}
                                >
                                    {addedCartId === selectedProduct._id ? (
                                        <>Added to Cart <Check size={16} /></>
                                    ) : (
                                        <><ShoppingBag size={16} /> Add to Cart — ₹{Number(selectedProduct.price || 0).toLocaleString('en-IN')}</>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </section>
    );
};

export default ProductCatalog;