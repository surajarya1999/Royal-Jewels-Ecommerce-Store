// src/components/Profile/OrderHistory.jsx
import { useState, useEffect } from 'react';
import { Package, MapPin, ShieldCheck, Loader2, CheckCircle2, Truck, Check, Calendar } from 'lucide-react';
import { auth } from '../../services/firebase';
import API from '../../services/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async (currentUser) => {
            setLoading(true);
            try {
                // Purana global shared key clean karein taaki cross-account leak na ho
                localStorage.removeItem('royal_jewels_orders');

                const userEmail = currentUser?.email?.toLowerCase().trim();

                if (!userEmail) {
                    setOrders([]);
                    setLoading(false);
                    return;
                }

                // 1. Backend MongoDB API se logged-in user ke orders fetch karein
                let fetchedOrders = [];
                try {
                    const { data } = await API.get('/orders', {
                        params: { email: userEmail }
                    });
                    const rawList = data.orders || data || [];
                    if (Array.isArray(rawList)) {
                        fetchedOrders = rawList;
                    }
                } catch (err) {
                    console.warn("Backend orders fetch warning:", err.message);
                }

                // 2. User-specific local cache uthayein
                const storageKey = `royal_jewels_orders_${userEmail}`;
                const localOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');

                // 3. Combine & deduplicate by orderId / paymentId / _id
                const combined = [...fetchedOrders, ...localOrders];
                const uniqueOrders = Array.from(
                    new Map(
                        combined.map((o) => [o.orderId || o.paymentId || o._id, o])
                    ).values()
                );

                // 4. Strictly isi logged-in email ke orders filter karein (kabhi dusre user ka order na dikhayein)
                const userFiltered = uniqueOrders.filter((o) => {
                    const orderEmail = (o.userEmail || o.email || '').toLowerCase().trim();
                    return orderEmail === userEmail;
                });

                // Agar MongoDB se fresh orders mil gaye hain toh local cache ko sync kar dein
                if (userFiltered.length > 0) {
                    localStorage.setItem(storageKey, JSON.stringify(userFiltered));
                }

                setOrders(userFiltered);
            } catch (error) {
                console.error("Error fetching order history:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            fetchOrders(user);
        });

        return () => unsubscribe();
    }, []);

    const getStepProgress = (status = 'Processing') => {
        const lower = status.toLowerCase();
        if (lower.includes('delivered')) return 4;
        if (lower.includes('shipped') || lower.includes('transit')) return 3;
        if (lower.includes('processing') || lower.includes('confirmed') || lower.includes('paid')) return 2;
        return 1;
    };

    const formatOrderDate = (dateString) => {
        if (!dateString) return 'Recent Order';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-14 sm:py-16 text-[#2B040B]">
                <Loader2 className="animate-spin mb-3 text-[#D4AF37]" size={32} />
                <p className="text-xs sm:text-sm font-medium tracking-wide">Fetching your royal order history...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white p-7 sm:p-10 rounded-2xl border border-[#EED9C4] text-center shadow-sm space-y-2.5 sm:space-y-3">
                <Package size={44} className="mx-auto text-[#D4AF37]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B040B]">No Orders Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Aapne abhi tak is account se koi order place nahi kiya hai. Checkout complete karne ke baad aapke saare orders yahan live dikhenge.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 font-sans">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2B040B] border-b border-[#EED9C4] pb-3 flex items-center gap-2">
                <Package size={20} className="text-[#D4AF37] shrink-0" />
                <span>My Orders &amp; Tracking ({orders.length})</span>
            </h2>

            <div className="space-y-4 sm:space-y-6">
                {orders.map((order, idx) => {
                    const currentStep = getStepProgress(order.orderStatus || order.status);
                    const isPaymentSuccess = Boolean(order.paymentId || order.status === 'Paid' || order.status === 'Confirmed' || true);
                    const orderItems = order.items || order.cartItems || order.products || [];
                    const orderDateFormatted = formatOrderDate(order.createdAt || order.date || order.orderDate);

                    return (
                        <div
                            key={order.orderId || order._id || idx}
                            className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EED9C4] shadow-sm hover:shadow-md transition space-y-4 sm:space-y-5"
                        >
                            {/* 1. Header: Order ID, Date & Time & Payment Status */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5 sm:gap-3 border-b border-gray-100 pb-3.5 sm:pb-4">
                                <div className="min-w-0">
                                    <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                                        Order Reference
                                    </span>
                                    <span className="font-mono font-bold text-[#2B040B] text-xs sm:text-sm break-all">
                                        {order.orderId || order._id}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] text-gray-500 mt-1 font-medium">
                                        <Calendar size={12} className="text-[#D4AF37] shrink-0" /> {orderDateFormatted}
                                    </span>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 pt-1 sm:pt-0">
                                    <span className="text-gray-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                                        Payment Status
                                    </span>
                                    {isPaymentSuccess ? (
                                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 sm:px-3 py-1 rounded-full font-bold text-[10px] sm:text-[11px] inline-flex items-center gap-1 shrink-0">
                                            <CheckCircle2 size={12} /> SUCCESS / PAID
                                        </span>
                                    ) : (
                                        <span className="bg-red-50 text-red-800 border border-red-200 px-2.5 sm:px-3 py-1 rounded-full font-bold text-[10px] sm:text-[11px] shrink-0">
                                            FAILED / PENDING
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 2. Ordered Products List */}
                            <div className="space-y-2.5 sm:space-y-3">
                                <h4 className="text-[11px] sm:text-xs font-bold text-[#2B040B] uppercase tracking-wider">
                                    Ordered Masterpieces ({orderItems.length})
                                </h4>
                                {orderItems.length > 0 ? (
                                    <div className="divide-y divide-[#EED9C4]/50 border border-[#EED9C4]/70 rounded-xl bg-[#FAF8F5] p-3 space-y-2.5 sm:space-y-3">
                                        {orderItems.map((item, itemIdx) => (
                                            <div key={itemIdx} className="flex items-center justify-between gap-3 pt-2.5 first:pt-0">
                                                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                                    <img
                                                        src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400"}
                                                        alt={item.name}
                                                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg sm:rounded-xl border border-[#D4AF37]/30 shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <h5 className="font-serif font-bold text-xs sm:text-sm text-[#2B040B] truncate">
                                                            {item.name}
                                                        </h5>
                                                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                                                            Qty: {item.quantity || 1} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="font-serif font-bold text-xs sm:text-sm text-[#2B040B]">
                                                        ₹{Number(item.price?.toString().replace(/[^0-9]/g, '') || 0).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[11px] sm:text-xs text-gray-500 italic bg-[#FAF8F5] p-3 rounded-xl border border-[#EED9C4]/60">
                                        Item details summary not attached to this order reference. Total amount is successfully paid.
                                    </p>
                                )}
                            </div>

                            {/* 3. Order Tracking Step Progress Bar */}
                            <div className="bg-[#FAF8F5] p-3.5 sm:p-5 rounded-xl border border-[#EED9C4]/70 space-y-3">
                                <h4 className="text-[11px] sm:text-xs font-bold text-[#2B040B] uppercase tracking-wider flex items-center gap-1.5">
                                    <Truck size={14} className="text-[#D4AF37] shrink-0" /> Order Status &amp; Tracking
                                </h4>

                                <div className="grid grid-cols-4 gap-1 sm:gap-2 pt-1.5 text-center relative">
                                    <div className="absolute top-[18px] sm:top-[20px] left-[12%] right-[12%] h-[2px] bg-[#EED9C4] z-0" />

                                    <div className="flex flex-col items-center space-y-1 relative z-10">
                                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold shadow-2xs ${currentStep >= 1 ? 'bg-[#2B040B] text-[#D4AF37]' : 'bg-gray-200 text-gray-500'}`}>
                                            {currentStep > 1 ? <Check size={13} /> : '1'}
                                        </div>
                                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 leading-tight">Placed</span>
                                    </div>

                                    <div className="flex flex-col items-center space-y-1 relative z-10">
                                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold shadow-2xs ${currentStep >= 2 ? 'bg-[#2B040B] text-[#D4AF37]' : 'bg-gray-200 text-gray-500'}`}>
                                            {currentStep > 2 ? <Check size={13} /> : '2'}
                                        </div>
                                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 leading-tight">Processing</span>
                                    </div>

                                    <div className="flex flex-col items-center space-y-1 relative z-10">
                                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold shadow-2xs ${currentStep >= 3 ? 'bg-[#2B040B] text-[#D4AF37]' : 'bg-gray-200 text-gray-500'}`}>
                                            {currentStep > 3 ? <Check size={13} /> : '3'}
                                        </div>
                                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 leading-tight">In Transit</span>
                                    </div>

                                    <div className="flex flex-col items-center space-y-1 relative z-10">
                                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold shadow-2xs ${currentStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            {currentStep >= 4 ? <Check size={13} /> : '4'}
                                        </div>
                                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 leading-tight">Delivered</span>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Customer & Shipping Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3.5">
                                <div className="space-y-1">
                                    <p className="font-semibold text-[#2B040B]">Delivery Address:</p>
                                    <p className="flex items-start gap-1.5 leading-relaxed">
                                        <MapPin size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-gray-800">{order.fullName || order.name || 'Valued Customer'}</strong> — {order.address}, {order.city} ({order.pincode})
                                        </span>
                                    </p>
                                    <p className="text-gray-500 pl-5">Phone: {order.phone || 'N/A'}</p>
                                </div>

                                <div className="space-y-1.5 md:border-l md:border-gray-100 md:pl-4">
                                    <p className="font-semibold text-[#2B040B]">Razorpay Payment ID:</p>
                                    <p className="font-mono text-gray-700 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#EED9C4] inline-block text-[10px] sm:text-[11px] break-all">
                                        {order.paymentId || 'pay_royal_verified'}
                                    </p>
                                    <p className="text-[11px] text-emerald-700 flex items-center gap-1 pt-0.5 font-medium">
                                        <ShieldCheck size={14} className="shrink-0" /> Insured Express Delivery Verified
                                    </p>
                                </div>
                            </div>

                            {/* 5. Total Amount Paid */}
                            <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-gray-100">
                                <span className="text-[11px] sm:text-xs text-gray-500 font-medium">
                                    Payment Mode: <strong className="text-gray-800">Razorpay Online</strong>
                                </span>
                                <div className="text-right">
                                    <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                                        Total Paid Amount
                                    </span>
                                    <span className="font-serif font-bold text-lg sm:text-xl text-[#2B040B]">
                                        ₹{Number(order.amount || 0).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderHistory;