import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }) => {
    if (!isOpen) return null;

    // Calculate Subtotal Safely (handles both numbers and formatted strings)
    const subtotal = cartItems.reduce((acc, item) => {
        const rawPrice = item.price !== undefined ? item.price : 0;
        const numPrice = typeof rawPrice === 'number'
            ? rawPrice
            : parseInt(String(rawPrice).replace(/[^\d]/g, '')) || 0;
        return acc + numPrice;
    }, 0);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            ></div>

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#EED9C4]">

                    {/* Drawer Header */}
                    <div className="flex items-center justify-between p-6 bg-[#2B040B] text-[#FAF8F5]">
                        <div className="flex items-center space-x-2">
                            <ShoppingBag size={22} className="text-[#D4AF37]" />
                            <h3 className="font-serif text-lg font-bold tracking-wider text-[#D4AF37]">
                                YOUR ROYAL BAG ({cartItems.length})
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-300 hover:text-white transition p-1"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-20">
                                <span className="text-4xl">👑</span>
                                <p className="text-gray-500 font-serif mt-3">Your shopping bag is empty.</p>
                                <p className="text-xs text-[#D4AF37] mt-1">Explore our collection to add pieces.</p>
                            </div>
                        ) : (
                            cartItems.map((item, index) => {
                                // Format display price safely
                                const displayPrice = typeof item.price === 'number'
                                    ? `₹${item.price.toLocaleString('en-IN')}`
                                    : item.price;

                                return (
                                    <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#EED9C4] shadow-sm">
                                        <div>
                                            <span className="text-[10px] font-bold text-[#D4AF37] uppercase">{item.code || 'BIS Hallmarked'}</span>
                                            <h4 className="font-serif font-bold text-[#2B040B] text-sm">{item.name}</h4>
                                            <p className="text-sm font-bold text-[#2B040B] mt-1">{displayPrice}</p>
                                        </div>
                                        <button
                                            onClick={() => onRemoveItem(index)}
                                            className="text-rose-500 hover:text-rose-700 p-2 transition"
                                            title="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Drawer Footer & Checkout */}
                    {cartItems.length > 0 && (
                        <div className="p-6 bg-white border-t border-[#EED9C4] space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Estimated Subtotal</span>
                                <span className="font-serif font-bold text-lg text-[#2B040B]">
                                    ₹{subtotal.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <p className="text-[11px] text-emerald-600 font-medium">✨ Free Insured Shipping & BIS Certification included</p>

                            <button
                                onClick={() => {
                                    onClose();
                                    onCheckout();
                                }}
                                className="w-full bg-[#2B040B] text-[#D4AF37] font-serif font-bold py-4 rounded-xl hover:bg-[#4A0A17] transition flex items-center justify-center gap-2 shadow-lg tracking-wider uppercase"
                            >
                                Proceed To Secure Checkout <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CartDrawer;