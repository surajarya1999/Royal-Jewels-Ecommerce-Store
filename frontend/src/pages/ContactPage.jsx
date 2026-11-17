// src/pages/ContactPage.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { auth } from '../services/firebase';
import API from '../services/api';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [userInquiries, setUserInquiries] = useState([]);

    const fetchUserInquiries = async (email) => {
        try {
            const { data } = await API.get('/contact');
            const allContacts = data.contacts || data || [];
            const filtered = allContacts.filter(c => c.email?.toLowerCase() === email.toLowerCase());
            setUserInquiries(filtered);
        } catch (err) {
            console.warn("Could not fetch user previous inquiries:", err);
        }
    };
    
    // Listen to auth state so user details & conversations load reliably even on refresh
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser?.email) {
                setFormData(prev => ({
                    ...prev,
                    email: prev.email || currentUser.email,
                    name: prev.name || currentUser.displayName || ''
                }));
                fetchUserInquiries(currentUser.email);
            }
        });
        return () => unsubscribe();
    }, []);



    // User-side Clear Single Inquiry Chat Handler
    const handleClearChat = async (inquiryId) => {
        if (!window.confirm("Are you sure you want to clear this conversation history?")) return;

        try {
            await API.delete(`/contact/${inquiryId}`);
            setUserInquiries(prev => prev.filter(item => item._id !== inquiryId));
        } catch (err) {
            console.error("Failed to clear chat:", err);
            alert("Failed to clear conversation. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { data } = await API.post('/contact', formData);
            if (data.success) {
                setSubmitted(true);
                setFormData(prev => ({ ...prev, message: '' }));
                if (formData.email) fetchUserInquiries(formData.email);
                setTimeout(() => setSubmitted(false), 5000);
            }
        } catch (error) {
            console.error("Contact form error:", error);
            setErrorMsg(error.response?.data?.message || 'Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-[#FAF8F5] border border-[#EED9C4] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm placeholder:text-xs placeholder-gray-400 text-[#2B040B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition";

    return (
        <div className="bg-[#FAF8F5] min-h-screen py-7 sm:py-12 px-3.5 sm:px-8 lg:px-16 text-[#2B040B] font-sans">

            {/* Header */}
            <div className="max-w-4xl mx-auto text-center space-y-2.5 sm:space-y-3 mb-7 sm:mb-12">
                <span className="bg-[#4A0A17] text-[#D4AF37] border border-[#D4AF37]/40 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase inline-flex items-center gap-1.5 sm:gap-2 shadow-xs">
                    <Sparkles size={12} className="sm:w-[14px] sm:h-[14px]" /> VIP Concierge Live <Sparkles size={12} className="sm:w-[14px] sm:h-[14px]" />
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#2B040B] leading-tight px-1">
                    Get In Touch With Our Royal Stylists
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
                    Bespoke bridal consultations, custom sizing, or order assistance — our heritage specialists are at your service.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start">

                {/* Left Column: Info & Live Chat History */}
                <div className="space-y-5 sm:space-y-6">
                    <div className="bg-[#2B040B] text-[#FAF8F5] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#D4AF37]/40 shadow-xl space-y-4 sm:space-y-6">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80 font-semibold">
                                Heritage Boutique
                            </span>
                            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] mt-1">
                                Royal Flagship Store & Studio
                            </h2>
                        </div>

                        <div className="space-y-3 text-xs sm:text-sm text-gray-200">
                            <div className="flex items-start sm:items-center gap-3">
                                <MapPin className="text-[#D4AF37] shrink-0 mt-0.5 sm:mt-0" size={17} />
                                <span>Bandra West, Mumbai - 400050</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-[#D4AF37] shrink-0" size={17} />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3 min-w-0">
                                <Mail className="text-[#D4AF37] shrink-0" size={17} />
                                <span className="break-all">concierge@royaljewels.com</span>
                            </div>
                        </div>
                    </div>

                    {/* LIVE CHAT MESSAGES HISTORY (User View) */}
                    {userInquiries.length > 0 && (
                        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#EED9C4] shadow-sm space-y-3.5 sm:space-y-4">
                            <h3 className="font-serif font-bold text-sm sm:text-base text-[#2B040B] flex items-center gap-2 justify-between border-b border-[#EED9C4]/70 pb-2.5">
                                <span className="flex items-center gap-2">
                                    <MessageCircle className="text-[#D4AF37] shrink-0" size={18} />
                                    <span>Your Active Conversations</span>
                                </span>
                                <span className="text-[11px] text-gray-500 bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#EED9C4] font-sans font-medium shrink-0">
                                    {userInquiries.length} {userInquiries.length === 1 ? 'Thread' : 'Threads'}
                                </span>
                            </h3>

                            <div className="space-y-3 sm:space-y-4 max-h-72 overflow-y-auto pr-1">
                                {userInquiries.map((inq) => (
                                    <div key={inq._id} className="bg-[#FAF8F5] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#EED9C4] space-y-2 text-xs relative group">

                                        {/* Header with Clear Chat Button */}
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="font-medium text-[#2B040B] flex-1 break-words leading-relaxed">
                                                <strong>You:</strong> {inq.message}
                                            </p>

                                            <button
                                                onClick={() => handleClearChat(inq._id)}
                                                className="text-gray-400 hover:text-red-600 p-1 transition cursor-pointer shrink-0 rounded-lg hover:bg-red-50 bg-transparent border-none"
                                                title="Clear this conversation"
                                                aria-label="Clear conversation"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Admin Replies */}
                                        {inq.replies && inq.replies.length > 0 ? (
                                            <div className="space-y-1.5 pt-2 border-t border-[#EED9C4]/70">
                                                {inq.replies.map((r, rIdx) => (
                                                    <div key={rIdx} className="bg-[#2B040B] text-[#D4AF37] p-2.5 sm:p-3 rounded-xl font-medium space-y-0.5">
                                                        <span className="block text-[9px] text-amber-300 font-bold uppercase tracking-wider">
                                                            Royal Concierge Stylist
                                                        </span>
                                                        <p className="text-xs text-[#FAF8F5] leading-relaxed break-words">{r.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-bold inline-block">
                                                ⏳ Awaiting Stylist Reply
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Message Form */}
                <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-[#EED9C4] shadow-md h-fit">
                    <div className="mb-5 sm:mb-6 pb-3 border-b border-[#EED9C4]/70">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B040B]">
                            Send Us A Message
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                            Our stylists typically respond within a few hours.
                        </p>
                    </div>

                    {submitted && (
                        <div className="bg-amber-50 border border-[#D4AF37] text-[#2B040B] p-3.5 sm:p-4 rounded-xl text-xs font-semibold mb-5 leading-relaxed">
                            ✨ Message sent! Stylist replies will appear live in your active conversation panel.
                        </div>
                    )}

                    {errorMsg && (
                        <div className="bg-red-50 border border-red-300 text-red-700 p-3.5 sm:p-4 rounded-xl text-xs font-semibold mb-5">
                            ❌ {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                        <div>
                            <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2B040B] mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your name"
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                            <div>
                                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2B040B] mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="yourname@gmail.com"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2B040B] mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2B040B] mb-1">
                                Message / Inquiry
                            </label>
                            <textarea
                                rows="4"
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell us about the design or assistance you need..."
                                className={`${inputClass} resize-none`}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2B040B] text-[#D4AF37] font-serif font-bold py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider hover:bg-[#4A0A17] active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-[#D4AF37]/30"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Send Message <Send size={14} /></>}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;