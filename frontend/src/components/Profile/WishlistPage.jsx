// src/components/Profile/WishlistPage.jsx
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';

const WishlistPage = ({
    wishlistItems = [],
    onAddToCart,
    onRemoveWishlist,
    onBackToShop,
    isEmbedded = false
}) => {
    const content = (
        <div className={isEmbedded ? "space-y-6" : "max-w-6xl mx-auto space-y-8"}>
            {/* Header Section */}
            {!isEmbedded ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EED9C4] pb-6">
                    <div>
                        {onBackToShop && (
                            <button
                                onClick={onBackToShop}
                                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E6D68] hover:text-[#2B040B] mb-2 cursor-pointer bg-transparent border-none"
                            >
                                <ArrowLeft size={14} /> Continue Shopping
                            </button>
                        )}
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2B040B] flex items-center gap-3">
                            <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={28} />
                            My Royal Wishlist ({wishlistItems.length})
                        </h1>
                    </div>
                    <span className="bg-[#2B040B] text-[#D4AF37] border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-[11px] font-serif tracking-widest uppercase self-start sm:self-auto">
                        Saved Masterpieces
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-between border-b border-[#EED9C4] pb-3">
                    <h2 className="text-xl font-serif font-bold text-[#2B040B] flex items-center gap-2">
                        <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={20} />
                        Saved Jewellery Wishlist ({wishlistItems.length})
                    </h2>
                </div>
            )}

            {/* Empty State */}
            {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#EED9C4] p-10 md:p-16 text-center shadow-sm space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                        <Heart size={30} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#2B040B]">Your Wishlist is Empty</h2>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto font-light leading-relaxed">
                        Aapne abhi tak koi jewelry save nahi ki hai. Apne pasandida Kundan, Polki aur American Diamond sets par heart icon dabayein.
                    </p>
                    {onBackToShop && (
                        <div className="pt-2">
                            <button
                                onClick={onBackToShop}
                                className="bg-[#2B040B] text-[#D4AF37] font-serif font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-[#4A0A17] transition shadow-lg cursor-pointer inline-flex items-center gap-2 border-none"
                            >
                                <Sparkles size={15} /> Explore Collections
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Wishlist Grid */
                <div className={`grid grid-cols-1 ${isEmbedded ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                    {wishlistItems.map((item, index) => (
                        <div
                            key={item._id || item.id || index}
                            className="bg-white rounded-3xl border border-[#EED9C4] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div className="relative bg-[#FAF8F5] h-56 overflow-hidden">
                                <img
                                    src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400"}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-3 left-3 bg-[#2B040B]/90 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#D4AF37]/40">
                                    {item.category || "Premium Replica"}
                                </span>
                                <button
                                    onClick={() => onRemoveWishlist && onRemoveWishlist(index)}
                                    title="Remove from Wishlist"
                                    className="absolute top-3 right-3 bg-white/95 hover:bg-red-50 text-red-500 hover:text-red-700 p-2 rounded-full shadow-md transition cursor-pointer border-none"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-serif font-bold text-lg text-[#2B040B] line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-light mt-1 line-clamp-2">
                                        {item.description || "22K Gold-Plated Anti-Tarnish Celebrity Replica Masterpiece"}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-gray-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase text-gray-400 font-bold">Price</span>
                                        <span className="font-serif font-bold text-xl text-[#2B040B]">
                                            ₹{Number(item.price?.toString().replace(/[^0-9]/g, '') || 0).toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                if (onAddToCart) onAddToCart(item);
                                                if (onRemoveWishlist) onRemoveWishlist(index);
                                            }}
                                            className="flex-1 bg-[#2B040B] text-[#D4AF37] hover:bg-[#4A0A17] text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-none"
                                        >
                                            <ShoppingBag size={14} /> Move to Bag
                                        </button>
                                        <button
                                            onClick={() => onRemoveWishlist && onRemoveWishlist(index)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (isEmbedded) {
        return <div className="bg-white p-6 rounded-2xl border border-[#EED9C4] shadow-sm">{content}</div>;
    }

    return (
        <div className="bg-[#FAF8F5] min-h-screen py-12 md:py-16 px-4 md:px-16 text-[#2B040B] antialiased selection:bg-[#D4AF37] selection:text-[#2B040B]">
            {content}
        </div>
    );
};

WishlistPage.propTypes = {
    wishlistItems: PropTypes.array,
    onAddToCart: PropTypes.func,
    onRemoveWishlist: PropTypes.func,
    onBackToShop: PropTypes.func,
    isEmbedded: PropTypes.bool
};

export default WishlistPage;