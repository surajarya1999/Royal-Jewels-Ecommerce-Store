// src/pages/admin/AdminContact.jsx
import { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle, Clock, Loader2, Inbox, Send, Trash2 } from 'lucide-react';
import API from '../../services/api';

export default function AdminContact() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const fetchInquiries = async () => {
        try {
            const { data } = await API.get('/contact');
            const fetchedList = data.contacts || data || [];

            const formatted = fetchedList.map((item) => ({
                id: item._id,
                name: item.name,
                email: item.email,
                phone: item.phone || 'N/A',
                subject: item.subject || 'VIP Concierge Inquiry',
                message: item.message,
                status: item.status || 'Pending',
                replies: item.replies || [],
                date: item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                    })
                    : 'Recent'
            }));

            setInquiries(formatted);
        } catch (error) {
            console.error("Error fetching contact inquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadInitialInquiries = async () => {
            try {
                const { data } = await API.get('/contact');
                const fetchedList = data.contacts || data || [];

                const formatted = fetchedList.map((item) => ({
                    id: item._id,
                    name: item.name,
                    email: item.email,
                    phone: item.phone || 'N/A',
                    subject: item.subject || 'VIP Concierge Inquiry',
                    message: item.message,
                    status: item.status || 'Pending',
                    replies: item.replies || [],
                    date: item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                        })
                        : 'Recent'
                }));

                if (isMounted) setInquiries(formatted);
            } catch (error) {
                console.error("Error fetching contact inquiries:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadInitialInquiries();
        return () => { isMounted = false; };
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
        setInquiries((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
        );
        try {
            await API.put(`/contact/${id}`, { status: nextStatus });
        } catch (err) {
            console.warn("Status update sync error:", err);
        }
    };

    // Delete Inquiry Handler
    const handleDeleteInquiry = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer inquiry?")) return;

        try {
            await API.delete(`/contact/${id}`);
            setInquiries((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Failed to delete inquiry:", err);
            alert("Failed to delete inquiry from server.");
        }
    };

    const handleSendReply = async (id) => {
        if (!replyText.trim()) return;
        setSending(true);

        try {
            const { data } = await API.post(`/contact/${id}/reply`, {
                message: replyText,
                sender: 'Admin'
            });

            if (data.success) {
                setReplyText('');
                setActiveReplyId(null);
                fetchInquiries();
            }
        } catch (err) {
            console.error("Failed to send admin reply:", err);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-10 sm:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-[#EED9C4] flex flex-col items-center justify-center text-[#2B040B]">
                <Loader2 className="animate-spin mb-3 text-[#D4AF37]" size={32} />
                <p className="text-xs font-serif font-bold tracking-wide">Loading Customer Inquiries...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-[#EED9C4] space-y-5 sm:space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#EED9C4] pb-4">
                <div>
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#2B040B]">
                        Customer Concierge &amp; Live Chat
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                        Manage, reply, or delete customer support inquiries.
                    </p>
                </div>
                <span className="bg-[#2B040B] text-[#D4AF37] px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-sm shrink-0">
                    {inquiries.filter((i) => i.status === 'Pending').length} Pending Requests
                </span>
            </div>

            {/* Empty State or Inquiries List */}
            {inquiries.length === 0 ? (
                <div className="text-center py-10 sm:py-12 text-gray-500 space-y-2">
                    <Inbox size={40} className="mx-auto text-[#D4AF37]" />
                    <p className="font-serif font-bold text-base text-[#2B040B]">Inbox is Clean</p>
                    <p className="text-xs text-gray-400">No contact inquiries have been submitted yet.</p>
                </div>
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    {inquiries.map((inq) => (
                        <div
                            key={inq.id}
                            className={`p-4 sm:p-6 rounded-2xl border transition-all ${inq.status === 'Pending'
                                ? 'bg-[#FAF8F5] border-[#D4AF37]/40 shadow-xs'
                                : 'bg-white border-gray-200 opacity-90'
                                }`}
                        >
                            {/* Top Customer Meta Row */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-3">
                                <div className="min-w-0">
                                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#2B040B] truncate">
                                        {inq.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-gray-500 mt-0.5">
                                        <span className="flex items-center gap-1 break-all">
                                            <Mail size={12} className="text-[#D4AF37] shrink-0" /> {inq.email}
                                        </span>
                                        <span className="flex items-center gap-1 shrink-0">
                                            <Phone size={12} className="text-[#D4AF37] shrink-0" /> {inq.phone}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-2 pt-1 md:pt-0 shrink-0">
                                    <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono">
                                        {inq.date}
                                    </span>
                                    <span
                                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${inq.status === 'Pending'
                                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                            }`}
                                    >
                                        {inq.status === 'Pending' ? <Clock size={11} /> : <CheckCircle size={11} />}
                                        {inq.status}
                                    </span>
                                </div>
                            </div>

                            {/* Main Customer Inquiry Message */}
                            <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#EED9C4]/70 text-xs sm:text-sm mb-3.5 sm:mb-4">
                                <p className="text-gray-700 font-medium leading-relaxed break-words">
                                    <strong className="text-[#2B040B]">Customer Message:</strong> {inq.message}
                                </p>
                            </div>

                            {/* Chat Thread */}
                            {inq.replies && inq.replies.length > 0 && (
                                <div className="space-y-2 mb-4 pl-3 sm:pl-4 border-l-2 border-[#D4AF37]">
                                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">
                                        Live Chat Conversation
                                    </span>
                                    {inq.replies.map((r, rIdx) => (
                                        <div
                                            key={rIdx}
                                            className={`p-3 rounded-xl text-xs max-w-full sm:max-w-lg break-words ${r.sender === 'Admin'
                                                ? 'bg-[#2B040B] text-[#D4AF37] sm:ml-auto'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            <span className="block text-[9px] opacity-75 font-bold uppercase tracking-wider mb-0.5">
                                                {r.sender}
                                            </span>
                                            <p className="text-[#FAF8F5] leading-relaxed">{r.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Box or Action Buttons */}
                            {activeReplyId === inq.id ? (
                                <div className="mt-3 bg-white p-3 sm:p-3.5 rounded-xl border border-[#D4AF37] space-y-2.5 sm:space-y-3 shadow-2xs">
                                    <textarea
                                        rows="2"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type VIP reply for this customer..."
                                        className="w-full text-xs sm:text-sm placeholder:text-xs p-2.5 sm:p-3 rounded-lg bg-[#FAF8F5]/60 border border-[#EED9C4] text-[#2B040B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none"
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setActiveReplyId(null)}
                                            className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 font-bold cursor-pointer bg-transparent border-none"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSendReply(inq.id)}
                                            disabled={sending}
                                            className="bg-[#2B040B] text-[#D4AF37] px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#4A0A17] transition disabled:opacity-50"
                                        >
                                            {sending ? <Loader2 className="animate-spin" size={13} /> : <Send size={13} />}
                                            Send Live Reply
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 justify-between sm:justify-end items-center pt-1">
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteInquiry(inq.id)}
                                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer sm:mr-auto"
                                        title="Delete Inquiry"
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>

                                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                                        <button
                                            onClick={() => toggleStatus(inq.id, inq.status)}
                                            className="flex-1 sm:flex-initial bg-transparent border border-[#2B040B] text-[#2B040B] hover:bg-[#2B040B] hover:text-[#D4AF37] px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer text-center"
                                        >
                                            Mark as {inq.status === 'Pending' ? 'Resolved' : 'Pending'}
                                        </button>

                                        <button
                                            onClick={() => { setActiveReplyId(inq.id); setReplyText(''); }}
                                            className="flex-1 sm:flex-initial bg-[#2B040B] text-[#D4AF37] hover:bg-[#4A0A17] px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                        >
                                            <MessageSquare size={13} /> Send VIP Reply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}