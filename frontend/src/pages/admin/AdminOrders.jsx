// src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, Loader2, MapPin } from 'lucide-react';
import API from '../../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchAllOrders = async () => {
            try {
                let backendOrders = [];
                try {
                    const res = await API.get('/orders');
                    backendOrders = res.data.orders || res.data || [];
                } catch {
                    console.log('Backend orders not reachable, using local storage');
                }

                const localOrders = JSON.parse(localStorage.getItem('royal_jewels_orders') || '[]');
                const combined = [...localOrders, ...backendOrders];
                const uniqueOrders = Array.from(
                    new Map(combined.map((o) => [o.orderId || o._id, o])).values()
                );

                if (isMounted) setOrders(uniqueOrders);
            } catch (err) {
                console.error('Error loading orders:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAllOrders();
        return () => { isMounted = false; };
    }, []);

    const handleStatusChange = async (order, newStatus) => {
        const targetId = order._id || order.orderId;
        setUpdatingId(targetId);

        try {
            // 1. Backend API par status update bhejein (Localhost & Live Atlas)
            try {
                await API.put(`/orders/${targetId}/status`, {
                    status: newStatus,
                });
            } catch {
                console.log('Updated locally (backend sync skipped)');
            }

            // 2. LocalStorage mein bhi update karein taaki immediate sync rahe
            const localOrders = JSON.parse(localStorage.getItem('royal_jewels_orders') || '[]');
            const updatedLocal = localOrders.map((o) =>
                (o.orderId === order.orderId || o._id === order._id)
                    ? { ...o, orderStatus: newStatus, status: newStatus }
                    : o
            );
            localStorage.setItem('royal_jewels_orders', JSON.stringify(updatedLocal));

            // 3. UI state update karein
            setOrders((prev) =>
                prev.map((o) =>
                    (o.orderId === order.orderId || o._id === order._id)
                        ? { ...o, orderStatus: newStatus, status: newStatus }
                        : o
                )
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status = 'Processing') => {
        const s = status.toLowerCase();
        if (s.includes('delivered')) {
            return (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 shrink-0">
                    <CheckCircle2 size={12} /> Delivered
                </span>
            );
        }
        if (s.includes('shipped') || s.includes('transit')) {
            return (
                <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 shrink-0">
                    <Truck size={12} /> Shipped
                </span>
            );
        }
        return (
            <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 shrink-0">
                <Clock size={12} /> Processing
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-white p-12 sm:p-16 rounded-2xl sm:rounded-3xl border border-[#EED9C4] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin mb-3 text-[#D4AF37]" size={32} />
                <p className="text-xs font-serif font-bold text-[#2B040B]">Loading Customer Orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 font-sans">
            {/* Header Card */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#EED9C4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B040B] flex items-center gap-2">
                        <Package className="text-[#D4AF37] shrink-0" size={20} />
                        <span>Order Fulfillment &amp; Dispatch</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                        Update order status to Shipped or Delivered for real-time customer tracking
                    </p>
                </div>
                <span className="bg-[#2B040B] text-[#D4AF37] px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shrink-0">
                    Total Orders: {orders.length}
                </span>
            </div>

            {/* Empty State or Orders List */}
            {orders.length === 0 ? (
                <div className="bg-white p-10 sm:p-12 rounded-2xl sm:rounded-3xl border border-[#EED9C4] text-center text-gray-500 text-xs sm:text-sm">
                    Abhi tak koi order place nahi hua hai.
                </div>
            ) : (
                <div className="space-y-3.5 sm:space-y-4">
                    {orders.map((order, idx) => {
                        const currentStatus = order.orderStatus || order.status || 'Processing';
                        const items = order.items || order.cartItems || order.products || [];
                        const targetId = order._id || order.orderId;

                        return (
                            <div
                                key={targetId || idx}
                                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#EED9C4] shadow-xs hover:border-[#D4AF37] transition space-y-3.5 sm:space-y-4"
                            >
                                {/* Top Row: Order ID, Customer Info & Status Selector */}
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 border-b border-gray-100 pb-3.5 sm:pb-4">
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-mono font-bold text-xs sm:text-sm text-[#2B040B] break-all">
                                                {order.orderId || order._id}
                                            </span>
                                            {getStatusBadge(currentStatus)}
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-gray-600 flex items-start gap-1.5 leading-relaxed">
                                            <MapPin size={13} className="text-[#D4AF37] shrink-0 mt-0.5" />
                                            <span>
                                                <strong className="text-[#2B040B]">{order.fullName || order.name || 'Customer'}</strong> ({order.phone || 'N/A'}) — {order.address}, {order.city} ({order.pincode})
                                            </span>
                                        </p>
                                    </div>

                                    {/* Status Action Dropdown */}
                                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-1 lg:pt-0">
                                        <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                            Status:
                                        </label>
                                        <select
                                            value={
                                                currentStatus.toLowerCase().includes('delivered')
                                                    ? 'Delivered'
                                                    : currentStatus.toLowerCase().includes('shipped')
                                                        ? 'Shipped'
                                                        : 'Processing'
                                            }
                                            disabled={updatingId === targetId}
                                            onChange={(e) => handleStatusChange(order, e.target.value)}
                                            className="w-full sm:w-auto bg-[#FAF8F5] border border-[#D4AF37] sm:border-2 text-[#2B040B] text-xs font-bold px-3 sm:px-3.5 py-2 rounded-xl focus:outline-none cursor-pointer disabled:opacity-60"
                                        >
                                            <option value="Processing">1. Processing</option>
                                            <option value="Shipped">2. Shipped (In Transit)</option>
                                            <option value="Delivered">3. Delivered</option>
                                        </select>
                                        {updatingId === targetId && (
                                            <Loader2 size={16} className="animate-spin text-[#D4AF37] shrink-0" />
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Row: Items Pills & Total Paid */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {items.length > 0 ? (
                                            items.map((item, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-[#FAF8F5] border border-[#EED9C4] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-medium text-[11px] sm:text-xs text-[#2B040B]"
                                                >
                                                    {item.name} × {item.quantity || 1}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic text-[11px]">Order items attached</span>
                                        )}
                                    </div>

                                    <div className="w-full sm:w-auto flex sm:block items-center justify-between border-t sm:border-t-0 border-gray-100 pt-2.5 sm:pt-0 text-right shrink-0">
                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                                            Total Paid
                                        </span>
                                        <span className="font-serif font-bold text-base sm:text-lg text-[#2B040B] sm:block">
                                            ₹{Number(order.amount || 0).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;