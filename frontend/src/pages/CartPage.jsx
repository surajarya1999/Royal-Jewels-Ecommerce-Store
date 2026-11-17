// src/pages/CartPage.jsx
import { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Crown, X } from 'lucide-react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';

const CartPage = ({ cartItems, onRemoveItem, onCheckout, onBackToShop }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // Calculate Subtotal Safely
    const subtotal = cartItems.reduce((acc, item) => {
        const rawPrice = item.price !== undefined ? item.price : 0;
        const numPrice = typeof rawPrice === 'number'
            ? rawPrice
            : parseInt(String(rawPrice).replace(/[^\d]/g, '')) || 0;
        return acc + numPrice * (item.quantity || 1);
    }, 0);

    // Handle Proceed To Checkout with Auth Check
    const handleProceedClick = () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            // User logged in nahi hai, toh login modal open karo
            setShowLoginModal(true);
        } else {
            // User logged in hai, checkout par jaane do
            onCheckout();
        }
    };

    // Google Sign In Handler
    const handleGoogleLogin = async () => {
        setLoginLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            setShowLoginModal(false);
            // Login successful hone ke baad direct checkout proceed karein
            onCheckout();
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Google Sign-In failed. Please try again.");
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="bg-[#FAF8F5] min-h-screen py-14 px-4 sm:px-8 md:px-16 text-[#2B040B] antialiased selection:bg-[#D4AF37] selection:text-[#2B040B] relative">

            {/* Luxury Editorial Header */}
            <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
                <span className="bg-[#2B040B] text-[#D4AF37] border border-[#D4AF37]/50 px-5 py-1.5 rounded-full text-[11px] font-medium tracking-[0.25em] uppercase inline-flex items-center gap-2 shadow-sm">
                    <Crown size={13} /> Royal Trousseau Bag <Crown size={13} />
                </span>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#2B040B]">
                    Your Curated <span className="italic font-light text-[#8C6239]">Selection</span>
                </h1>

                <p className="text-xs sm:text-sm text-[#6E5D5F] tracking-wide font-light">
                    {cartItems.length} {cartItems.length === 1 ? 'Masterpiece' : 'Masterpieces'} reserved in your private bag
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                {cartItems.length === 0 ? (
                    <div className="bg-white p-14 rounded-3xl border border-[#EED9C4] text-center space-y-5 shadow-sm max-w-xl mx-auto">
                        <div className="w-16 h-16 bg-[#FAF8F5] border border-[#D4AF37]/40 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag size={28} strokeWidth={1.5} className="text-[#D4AF37]" />
                        </div>
                        <h3 className="font-serif text-3xl font-normal text-[#2B040B] tracking-tight">
                            Your Royal Bag is Empty
                        </h3>
                        <p className="text-gray-500 text-sm font-light leading-relaxed max-w-sm mx-auto">
                            Explore our signature heritage collection of Uncut Kundan, Polki, and Certified Solitaire masterpieces.
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={onBackToShop}
                                className="bg-[#2B040B] text-[#D4AF37] px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#4A0A17] transition shadow-md cursor-pointer"
                            >
                                Explore Jewellery
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-5">
                            {cartItems.map((item, index) => {
                                const displayPrice = typeof item.price === 'number'
                                    ? `₹${item.price.toLocaleString('en-IN')}`
                                    : item.price;

                                return (
                                    <div
                                        key={index}
                                        className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EED9C4]/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-5"
                                    >
                                        <div className="flex items-center gap-5 w-full sm:w-auto">
                                            <img
                                                src={item.image || item.imageUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300"}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded-2xl border border-[#EED9C4] shrink-0 bg-[#FAF8F5]"
                                            />
                                            <div className="space-y-1.5">
                                                <span className="text-[10px] font-semibold text-[#9E6D68] uppercase tracking-[0.22em] block">
                                                    {item.material || item.category || 'BIS 22K Hallmarked'}
                                                </span>
                                                <h4 className="font-serif font-medium text-[#2B040B] text-lg sm:text-xl leading-snug">
                                                    {item.name}
                                                </h4>
                                                <div className="font-serif text-base font-semibold text-[#2B040B] tracking-wide">
                                                    {displayPrice}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                                            <span className="text-xs uppercase tracking-[0.15em] text-gray-500 font-medium bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#EED9C4]">
                                                Qty: {item.quantity || 1}
                                            </span>
                                            <button
                                                onClick={() => onRemoveItem(index)}
                                                className="text-gray-400 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-medium tracking-wide"
                                                title="Remove masterpiece"
                                            >
                                                <Trash2 size={15} strokeWidth={1.75} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="bg-white p-7 md:p-8 rounded-3xl border border-[#D4AF37]/40 shadow-sm h-fit space-y-6">
                            <div className="border-b border-[#EED9C4] pb-4">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-[#9E6D68] font-semibold">
                                    Concierge Summary
                                </span>
                                <h3 className="font-serif text-2xl font-normal text-[#2B040B] mt-1">
                                    Order Valuation
                                </h3>
                            </div>

                            <div className="space-y-3.5 text-sm font-light">
                                <div className="flex justify-between text-gray-600">
                                    <span>Jewellery Subtotal</span>
                                    <span className="font-serif font-semibold text-base text-[#2B040B]">
                                        ₹{subtotal.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Armored Insured Transit</span>
                                    <span className="text-emerald-800 font-semibold uppercase text-[10px] tracking-widest bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                        Complimentary
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>IGI / BIS Certification</span>
                                    <span className="text-emerald-800 font-semibold uppercase text-[10px] tracking-widest bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                        Included
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-[#EED9C4] pt-5 flex justify-between items-baseline">
                                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-500">
                                    Grand Total
                                </span>
                                <span className="font-serif font-semibold text-2xl sm:text-3xl text-[#2B040B]">
                                    ₹{subtotal.toLocaleString('en-IN')}
                                </span>
                            </div>

                            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EED9C4] flex items-start gap-3 text-xs text-[#5E4B4D] font-light leading-relaxed">
                                <ShieldCheck className="text-[#D4AF37] shrink-0 mt-0.5" size={18} />
                                <span>100% Insured Doorstep Delivery & 100% Gold Value Lifetime Exchange Guarantee.</span>
                            </div>

                            <div className="space-y-3 pt-1">
                                <button
                                    onClick={handleProceedClick}
                                    className="w-full bg-[#2B040B] text-[#D4AF37] font-medium py-4 rounded-full hover:bg-[#4A0A17] transition flex items-center justify-center gap-2.5 shadow-lg tracking-[0.2em] uppercase text-xs cursor-pointer"
                                >
                                    Proceed To Checkout <ArrowRight size={15} />
                                </button>
                                <button
                                    onClick={onBackToShop}
                                    className="w-full bg-transparent border border-[#2B040B]/30 text-[#2B040B] hover:border-[#2B040B] hover:bg-[#FAF8F5] py-3.5 rounded-full font-medium text-xs uppercase tracking-[0.18em] transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <ArrowLeft size={14} /> Continue Exploring
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* GOOGLE LOGIN MODAL (Triggered if user is not logged in) */}
            {showLoginModal && (
                <div
                    onClick={() => setShowLoginModal(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-[#D4AF37]/50 text-center space-y-6"
                    >
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full bg-gray-50 transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="w-14 h-14 bg-[#2B040B] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-md">
                            <Crown size={26} />
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-serif text-2xl font-bold text-[#2B040B]">
                                Authentication Required
                            </h3>
                            <p className="text-xs text-gray-500 font-light leading-relaxed">
                                Please sign in with your Google account to secure your royal order and proceed with checkout.
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={loginLoading}
                            onClick={handleGoogleLogin}
                            className="w-full bg-[#2B040B] text-[#D4AF37] hover:bg-[#4A0A17] py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition flex items-center justify-center gap-3 shadow-md cursor-pointer disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.2 9 5 12 5z" />
                                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                                <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.2 0 15s.7 5.4 1.9 7.8l3.7-2.9c-.3-.9-.5-1.9-.5-2.9z" />
                                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.8 7.5 23 12 23z" />
                            </svg>
                            {loginLoading ? 'Authenticating...' : 'Continue with Google'}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CartPage;