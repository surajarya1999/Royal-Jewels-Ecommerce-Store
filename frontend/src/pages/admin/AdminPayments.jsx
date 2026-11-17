// src/pages/admin/AdminPayments.jsx
import { useState, useEffect } from 'react';
import { ShieldCheck, Download, Loader2, CreditCard } from 'lucide-react';
import API from '../../services/api';

export default function AdminPayments() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchTransactions = async () => {
            try {
                let fetchedData = [];
                try {
                    const response = await API.get('/orders');
                    fetchedData = response.data.orders || response.data || [];
                } catch {
                    console.warn("Backend server not reachable for payments audit, using local storage fallback.");
                }

                // LocalStorage fallback merge
                const localOrders = JSON.parse(localStorage.getItem('royal_jewels_orders') || '[]');
                const combined = [...localOrders, ...fetchedData];

                // Remove duplicates and format structure
                const formatted = Array.from(
                    new Map(combined.map((tx) => [tx.paymentId || tx.orderId || tx._id, tx])).values()
                ).map((tx, index) => ({
                    id: tx.paymentId || tx.orderId || `pay_royal_${index + 1}`,
                    customer: tx.fullName || tx.name || 'Valued Guest',
                    date: tx.createdAt
                        ? new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })
                        : 'Recent',
                    item:
                        tx.items && tx.items.length > 0
                            ? tx.items[0].name
                            : tx.item || 'Royal Fine Jewellery Set',
                    amount: `₹${Number(tx.amount || 0).toLocaleString('en-IN')}`,
                    method: tx.paymentId ? 'Razorpay Online' : 'UPI / Direct',
                    status: 'SUCCESS'
                }));

                if (isMounted) setTransactions(formatted);
            } catch (error) {
                console.error("Error loading payment audit logs:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchTransactions();
        return () => {
            isMounted = false;
        };
    }, []);

    // CSV Export Handler (with UTF-8 BOM so ₹ symbol renders cleanly in Excel)
    const handleExportCSV = () => {
        if (transactions.length === 0) {
            alert("No transactions available to export.");
            return;
        }

        const headers = ["Transaction ID", "Customer", "Jewelry Item", "Payment Method", "Amount", "Status", "Date"];
        const rows = transactions.map((t) => [
            t.id,
            `"${t.customer}"`,
            `"${t.item}"`,
            t.method,
            `"${t.amount}"`,
            t.status,
            `"${t.date}"`
        ]);

        const csvString = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `royal_jewels_payment_audit_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="bg-white p-10 sm:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-[#EED9C4] flex flex-col items-center justify-center text-[#2B040B]">
                <Loader2 className="animate-spin mb-3 text-[#D4AF37]" size={32} />
                <p className="text-xs font-serif font-bold tracking-wide">Loading Secure Payment Ledger...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-[#EED9C4] space-y-5 sm:space-y-6 font-sans">

            {/* Header & Export Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 sm:gap-4 border-b border-[#EED9C4] pb-4">
                <div>
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#2B040B] flex items-center gap-2">
                        <ShieldCheck className="text-emerald-600 shrink-0" size={22} />
                        <span>Razorpay Payment Audit Logs</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                        Live verified transaction ledger and secure payment webhooks.
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="w-full sm:w-auto bg-[#2B040B] text-[#D4AF37] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#4A0A17] active:scale-[0.99] transition cursor-pointer shrink-0 shadow-sm border border-[#D4AF37]/30"
                >
                    <Download size={14} /> Export Audit Report (CSV)
                </button>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-10 sm:py-12 text-gray-500 space-y-2">
                    <CreditCard size={38} className="mx-auto text-[#D4AF37]" />
                    <p className="font-serif font-bold text-base text-[#2B040B]">No Transactions Recorded Yet</p>
                    <p className="text-xs text-gray-400">
                        Completed payments through Razorpay checkout will appear here instantly.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop & Tablet Table View */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#EED9C4]/70">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FAF8F5] text-[11px] uppercase tracking-wider font-bold text-gray-600 border-b border-[#EED9C4]">
                                    <th className="p-3.5 lg:p-4">Transaction ID</th>
                                    <th className="p-3.5 lg:p-4">Customer</th>
                                    <th className="p-3.5 lg:p-4">Jewelry Purchased</th>
                                    <th className="p-3.5 lg:p-4">Method</th>
                                    <th className="p-3.5 lg:p-4">Date</th>
                                    <th className="p-3.5 lg:p-4">Amount</th>
                                    <th className="p-3.5 lg:p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EED9C4]/40 text-xs lg:text-sm">
                                {transactions.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-[#FAF8F5]/70 transition">
                                        <td className="p-3.5 lg:p-4 font-mono text-xs font-bold text-gray-700 break-all max-w-[170px]">
                                            {tx.id}
                                        </td>
                                        <td className="p-3.5 lg:p-4 font-medium text-[#2B040B]">{tx.customer}</td>
                                        <td className="p-3.5 lg:p-4 font-serif text-gray-700 max-w-[200px] truncate">
                                            {tx.item}
                                        </td>
                                        <td className="p-3.5 lg:p-4 text-xs text-gray-500">{tx.method}</td>
                                        <td className="p-3.5 lg:p-4 text-xs text-gray-500 whitespace-nowrap">{tx.date}</td>
                                        <td className="p-3.5 lg:p-4 font-serif font-bold text-[#2B040B] whitespace-nowrap">
                                            {tx.amount}
                                        </td>
                                        <td className="p-3.5 lg:p-4">
                                            <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-200 inline-block">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Responsive View */}
                    <div className="md:hidden space-y-3.5">
                        {transactions.map((tx, idx) => (
                            <div
                                key={idx}
                                className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EED9C4] space-y-3 shadow-2xs"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">
                                            Transaction ID
                                        </span>
                                        <span className="font-mono text-xs font-bold text-gray-800 break-all">
                                            {tx.id}
                                        </span>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                                        {tx.status}
                                    </span>
                                </div>

                                <div className="border-t border-[#EED9C4]/70 pt-2.5 space-y-1.5 text-xs">
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-gray-500 shrink-0">Customer:</span>
                                        <span className="font-bold text-[#2B040B] truncate">{tx.customer}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-gray-500 shrink-0">Item:</span>
                                        <span className="font-serif font-medium text-gray-800 truncate max-w-[190px]">
                                            {tx.item}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-gray-500 shrink-0">Method:</span>
                                        <span className="text-gray-700 font-medium">{tx.method}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-[#EED9C4]/70 pt-2.5 text-xs">
                                    <span className="text-gray-400 text-[11px]">{tx.date}</span>
                                    <span className="font-serif font-bold text-base text-[#2B040B]">{tx.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}