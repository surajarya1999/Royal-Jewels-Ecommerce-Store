// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, MapPin, Sparkles, Lock } from 'lucide-react';
import { createRazorpayOrder, saveOrderRecord } from '../services/api';

const CheckoutPage = ({ cartItems, onBackToShop, onOrderSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(false);

    // Safe subtotal calculation for both Numbers and Strings
    const subtotal = cartItems.reduce((acc, item) => {
        const rawPrice = item.price !== undefined ? item.price : 0;
        const numPrice = typeof rawPrice === 'number'
            ? rawPrice
            : parseInt(String(rawPrice).replace(/[^\d]/g, '')) || 0;
        return acc + numPrice;
    }, 0);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Dynamically load Razorpay Checkout script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Real Razorpay Gateway Trigger & Database Saving
    const handleRazorpayPayment = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.phone || !formData.address) {
            alert('Please fill in all required shipping details.');
            return;
        }

        setLoading(true);

        try {
            // 1. Load Razorpay SDK Script
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                alert('Razorpay SDK failed to load. Please check your internet connection.');
                setLoading(false);
                return;
            }

            // 2. Call Backend to create Razorpay Order
            const { data } = await createRazorpayOrder({ amount: subtotal });

            if (!data.success) {
                alert('Failed to create secure payment order on server.');
                setLoading(false);
                return;
            }

            const { order } = data;

            // 3. Configure Razorpay Options
            const options = {
                key: "rzp_test_REdlTPcUa6qhPw",
                amount: order.amount,
                currency: order.currency,
                name: "Royal Jewels Luxury Store",
                description: "Heritage Fine Jewelry Purchase",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        setLoading(true);
                        const orderPayload = {
                            fullName: formData.fullName,
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address,
                            city: formData.city,
                            pincode: formData.pincode,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            amount: subtotal,
                            items: cartItems
                        };

                        let savedOrderObj = null;

                        // Try saving to backend database
                        try {
                            const saveResponse = await saveOrderRecord(orderPayload);
                            if (saveResponse && saveResponse.success) {
                                savedOrderObj = saveResponse.order;
                            }
                        } catch (serverErr) {
                            console.warn("Backend save failed, falling back to local storage:", serverErr);
                        }

                        // Guaranteed Fallback: Save to LocalStorage so it instantly shows in Order History
                        const existingOrders = JSON.parse(localStorage.getItem('royal_jewels_orders') || '[]');
                        const newLocalOrder = {
                            ...orderPayload,
                            _id: response.razorpay_order_id || `RJ-${Date.now()}`,
                            orderStatus: 'Processing',
                            createdAt: new Date().toISOString()
                        };
                        localStorage.setItem('royal_jewels_orders', JSON.stringify([newLocalOrder, ...existingOrders]));

                        alert(`🎉 Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

                        onOrderSuccess({
                            ...formData,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            dbOrder: savedOrderObj || newLocalOrder
                        });

                    } catch (err) {
                        console.error("Order Processing Error:", err);
                        alert("Something went wrong while processing your order completion.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: {
                    address: formData.address,
                },
                theme: {
                    color: "#2B040B", // Royal Maroon Theme
                },
            };

            const rzpModal = new window.Razorpay(options);
            rzpModal.open();

        } catch (error) {
            console.error("Razorpay Checkout Error:", error);
            alert("Something went wrong while opening Razorpay payment window.");
        } finally {
            setLoading(false);
        }
    };

    // Shared sleek input class for uniform mobile & desktop typography
    const inputClass =
        "w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm placeholder:text-xs placeholder:text-gray-400 rounded-xl bg-[#FAF8F5]/60 border border-[#EED9C4] text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition";

    return (
        <div className="min-h-screen bg-[#FAF8F5] py-5 sm:py-10 px-3.5 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37]/20">
            <div className="max-w-5xl mx-auto">

                {/* Top Navigation & Brand Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-8 pb-3.5 border-b border-[#EED9C4]/70">
                    <div>
                        <button
                            onClick={onBackToShop}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2B040B] uppercase tracking-widest mb-1.5 hover:text-[#B8860B] transition-colors cursor-pointer bg-transparent border-none p-0"
                        >
                            <ArrowLeft size={14} /> Back to Boutique
                        </button>
                        <h1 className="text-xl sm:text-3xl font-serif font-bold text-[#2B040B] tracking-tight flex items-center gap-2">
                            Secure Luxury Checkout
                            <Sparkles className="text-[#D4AF37] hidden sm:inline" size={20} />
                        </h1>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#EED9C4] shadow-2xs self-start sm:self-auto">
                        <Lock size={12} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-semibold text-[#2B040B] tracking-wider uppercase">
                            256-Bit SSL Encrypted
                        </span>
                    </div>
                </div>

                {/* Main Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">

                    {/* Order Summary Sidebar */}
                    <div className="order-1 lg:order-2 lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[#EED9C4] space-y-4 lg:sticky lg:top-8">
                        <div className="flex items-center justify-between border-b border-[#EED9C4] pb-3">
                            <h3 className="font-serif font-bold text-base sm:text-lg text-[#2B040B]">
                                Your Royal Bag
                            </h3>
                            <span className="text-[11px] font-bold bg-[#FAF8F5] text-[#2B040B] px-2.5 py-0.5 rounded-full border border-[#EED9C4]">
                                {cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'}
                            </span>
                        </div>

                        {/* Item List */}
                        <div className="space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-1">
                            {cartItems.map((item, idx) => {
                                const displayPrice = typeof item.price === 'number'
                                    ? `₹${item.price.toLocaleString('en-IN')}`
                                    : item.price;

                                return (
                                    <div key={idx} className="flex items-center justify-between gap-2.5 py-1 border-b border-gray-50 last:border-none">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded-lg object-cover border border-[#EED9C4] flex-shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-gray-800 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    BIS Hallmarked • Insured
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-xs text-[#2B040B] flex-shrink-0">
                                            {displayPrice}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-[#EED9C4] pt-3 space-y-2 text-xs">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-emerald-700 font-medium">
                                <span>Insured Delivery</span>
                                <span className="uppercase tracking-wider text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                            </div>
                            <div className="flex justify-between items-baseline text-sm sm:text-base font-serif font-bold text-[#2B040B] pt-2.5 border-t border-[#EED9C4]/70">
                                <span>Total Payable</span>
                                <span className="text-lg sm:text-xl text-[#2B040B]">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Trust Badge */}
                        <div className="p-3 bg-gradient-to-r from-[#FAF8F5] to-[#F5EFE6] rounded-xl border border-[#EED9C4] flex items-center gap-2.5 text-[11px] text-gray-700">
                            <ShieldCheck size={20} className="text-[#D4AF37] flex-shrink-0" />
                            <span className="leading-snug">
                                Protected by <strong className="text-[#2B040B]">Royal Jewels Guarantee</strong> & Razorpay.
                            </span>
                        </div>
                    </div>

                    {/* Shipping Form */}
                    <div className="order-2 lg:order-1 lg:col-span-7 bg-white p-4 sm:p-7 rounded-2xl shadow-sm border border-[#EED9C4]">
                        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#EED9C4]/70">
                            <div className="w-7 h-7 rounded-full bg-[#2B040B] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                                <MapPin size={14} />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2B040B]">
                                    Shipping Destination
                                </h3>
                                <p className="text-[11px] text-gray-500">Enter delivery details for your order</p>
                            </div>
                        </div>

                        <form onSubmit={handleRazorpayPayment} className="space-y-3.5 sm:space-y-4">
                            <div>
                                <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    placeholder="Ananya Sharma"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                <div>
                                    <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="ananya@gmail.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="address"
                                    rows="2"
                                    required
                                    placeholder="House No., Street, Landmark..."
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`${inputClass} resize-none`}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        placeholder="Mumbai"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-[11px] font-bold text-[#2B040B] uppercase tracking-wider mb-1">
                                        Pincode <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        required
                                        inputMode="numeric"
                                        maxLength="6"
                                        placeholder="400001"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || cartItems.length === 0}
                                    className="w-full bg-[#2B040B] text-[#D4AF37] font-serif font-bold py-3.5 sm:py-4 px-5 rounded-xl hover:bg-[#4A0A17] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg tracking-wider uppercase text-xs sm:text-sm disabled:opacity-50 cursor-pointer border border-[#D4AF37]/30"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} /> Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={16} /> Pay ₹{subtotal.toLocaleString('en-IN')} Securely
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;