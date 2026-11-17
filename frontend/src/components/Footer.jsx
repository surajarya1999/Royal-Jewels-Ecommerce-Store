// src/components/Footer.jsx
import { useState } from 'react';
import { Crown, ShieldCheck, Truck, RefreshCw, Phone, Mail, MapPin, Camera, Globe, Video, X } from 'lucide-react';

const legalPolicies = {
    privacy: {
        title: "Privacy Policy",
        updated: "Effective Date: November 2026",
        content: [
            "At ROYAL JEWELS, your privacy and data security are paramount. We collect personal details (name, contact number, shipping address, and email via Google Authentication) strictly to process and deliver your fashion jewellery orders.",
            "We never sell, rent, or trade your personal or financial information with third-party marketing agencies. All payment gateways are 256-bit SSL encrypted and PCI-DSS compliant.",
            "You may request access to, correction of, or deletion of your account data at any time by contacting our concierge desk at concierge@royaljewels.in."
        ]
    },
    terms: {
        title: "Terms & Conditions",
        updated: "Last Updated: November 2026",
        content: [
            "All jewellery pieces listed on ROYAL JEWELS are premium fashion & replica creations crafted with 22K micro gold-plating, AAA+ American Diamonds (CZ), and skin-friendly brass/alloy bases (non-real gold/diamond).",
            "Slight variations in stone setting, polish tone, or pearl finish may occur due to handcrafted artistry. All prices are inclusive of applicable GST.",
            "Please store pieces in the provided air-tight velvet box away from direct perfume, water, and harsh chemicals to preserve the anti-tarnish shine."
        ]
    },
    exchange: {
        title: "7-Day Replacement & Return Policy",
        updated: "Royal Quality Assurance",
        content: [
            "7-Day Easy Replacement: If you receive a damaged, defective, or incorrect piece, you can request a hassle-free replacement or store credit within 7 days of delivery.",
            "Mandatory Unboxing Video: A continuous, unedited 360-degree parcel unboxing video from start to finish is mandatory for claiming transit damage or missing item replacements.",
            "Hygiene & Condition: Returned items must be unused, unworn, and in their original tamper-proof packaging with intact tags."
        ]
    }
};

const Footer = ({ onNavigate }) => {
    const [activePolicy, setActivePolicy] = useState(null);

    const handleNav = (page) => {
        if (onNavigate) {
            onNavigate(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-[#2B040B] text-[#FAF8F5] border-t border-[#D4AF37]/40 antialiased selection:bg-[#D4AF37] selection:text-[#2B040B]">

            {/* Top Trust Strip */}
            <div className="border-b border-[#D4AF37]/20 bg-[#1F0207]">
                <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3.5">
                        <div className="p-2.5 rounded-full bg-[#2B040B] border border-[#D4AF37]/40 text-[#D4AF37]">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="font-serif text-sm font-semibold text-[#D4AF37] tracking-wide">Anti-Tarnish Micro Plating</h4>
                            <p className="text-[11px] text-gray-400 font-light">Skin-Friendly 22K Gold & AD Finish</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-3.5">
                        <div className="p-2.5 rounded-full bg-[#2B040B] border border-[#D4AF37]/40 text-[#D4AF37]">
                            <Truck size={20} />
                        </div>
                        <div>
                            <h4 className="font-serif text-sm font-semibold text-[#D4AF37] tracking-wide">Free Express Shipping</h4>
                            <p className="text-[11px] text-gray-400 font-light">Safe & Fast Pan-India Delivery</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-3.5">
                        <div className="p-2.5 rounded-full bg-[#2B040B] border border-[#D4AF37]/40 text-[#D4AF37]">
                            <RefreshCw size={20} />
                        </div>
                        <div>
                            <h4 className="font-serif text-sm font-semibold text-[#D4AF37] tracking-wide">7-Day Easy Replacement</h4>
                            <p className="text-[11px] text-gray-400 font-light">Hassle-Free Quality Warranty</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Column 1: Brand Identity */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                        <Crown className="text-[#D4AF37]" size={24} />
                        <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#D4AF37]">
                            ROYAL JEWELS
                        </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">
                        Accessible royal elegance crafted for modern celebrations. Explore handcrafted 22K gold-plated Kundan, Polki, and AAA+ American Diamond replica masterpieces.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        <span
                            title="Gallery & Lookbook"
                            className="w-9 h-9 rounded-full bg-[#4A0A17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] cursor-pointer hover:bg-[#D4AF37] hover:text-[#2B040B] transition"
                        >
                            <Camera size={16} />
                        </span>
                        <span
                            title="Global Shipping"
                            className="w-9 h-9 rounded-full bg-[#4A0A17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] cursor-pointer hover:bg-[#D4AF37] hover:text-[#2B040B] transition"
                        >
                            <Globe size={16} />
                        </span>
                        <span
                            title="Virtual Showcase"
                            className="w-9 h-9 rounded-full bg-[#4A0A17] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] cursor-pointer hover:bg-[#D4AF37] hover:text-[#2B040B] transition"
                        >
                            <Video size={16} />
                        </span>
                    </div>
                </div>

                {/* Column 2: Quick Navigation */}
                <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                        Royal Boutique
                    </h4>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-light">
                        <li>
                            <button onClick={() => handleNav('home')} className="hover:text-[#D4AF37] transition cursor-pointer">
                                Signature Home
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNav('collections')} className="hover:text-[#D4AF37] transition cursor-pointer">
                                Exclusive Replica Collections
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNav('about')} className="hover:text-[#D4AF37] transition cursor-pointer">
                                Heritage & Craftsmanship
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNav('contact')} className="hover:text-[#D4AF37] transition cursor-pointer">
                                Bridal Styling & Support
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNav('profile')} className="hover:text-[#D4AF37] transition cursor-pointer">
                                My Royal Account & Orders
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Legal & Policies */}
                <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                        Policies & Legal
                    </h4>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-light">
                        <li>
                            <button
                                type="button"
                                onClick={() => setActivePolicy('terms')}
                                className="hover:text-[#D4AF37] transition cursor-pointer text-left"
                            >
                                Terms & Conditions
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActivePolicy('privacy')}
                                className="hover:text-[#D4AF37] transition cursor-pointer text-left"
                            >
                                Privacy Policy
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActivePolicy('exchange')}
                                className="hover:text-[#D4AF37] transition cursor-pointer text-left"
                            >
                                7-Day Replacement Warranty
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() => setActivePolicy('exchange')}
                                className="hover:text-[#D4AF37] transition cursor-pointer text-left"
                            >
                                Shipping & Return Policy
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Concierge Contact */}
                <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                        Royal Concierge
                    </h4>
                    <ul className="space-y-3 text-xs text-gray-300 font-light">
                        <li className="flex items-start gap-2.5">
                            <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>Flagship Studio: Johari Bazaar & Maharani Bagh, New Delhi / Gwalior, India</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone size={15} className="text-[#D4AF37] shrink-0" />
                            <span>+91 98765 43210 (10 AM – 8 PM IST)</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Mail size={15} className="text-[#D4AF37] shrink-0" />
                            <span>concierge@royaljewels.in</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Bottom Copyright Bar */}
            <div className="border-t border-[#D4AF37]/20 bg-[#1F0207] py-5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
                    <p>© 2026 ROYAL JEWELS Premium Fashion & Replica Artistry. All Rights Reserved.</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button onClick={() => setActivePolicy('terms')} className="hover:text-[#D4AF37] transition cursor-pointer">
                            Terms of Service
                        </button>
                        <span>•</span>
                        <button onClick={() => setActivePolicy('privacy')} className="hover:text-[#D4AF37] transition cursor-pointer">
                            Privacy Policy
                        </button>
                        <span>•</span>
                        <button onClick={() => setActivePolicy('exchange')} className="hover:text-[#D4AF37] transition cursor-pointer">
                            Anti-Tarnish Warranty
                        </button>
                    </div>
                </div>
            </div>

            {/* POLICY READER MODAL */}
            {activePolicy && legalPolicies[activePolicy] && (
                <div
                    onClick={() => setActivePolicy(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white text-[#2B040B] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/50 relative space-y-4 max-h-[85vh] overflow-y-auto"
                    >
                        <button
                            type="button"
                            onClick={() => setActivePolicy(null)}
                            className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="border-b border-[#EED9C4] pb-3">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9E6D68] font-bold">
                                ROYAL JEWELS LEGAL
                            </span>
                            <h3 className="font-serif text-2xl font-bold text-[#2B040B] mt-1">
                                {legalPolicies[activePolicy].title}
                            </h3>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                {legalPolicies[activePolicy].updated}
                            </p>
                        </div>

                        <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                            {legalPolicies[activePolicy].content.map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setActivePolicy(null)}
                                className="bg-[#2B040B] text-[#D4AF37] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#4A0A17] transition cursor-pointer"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </footer>
    );
};

export default Footer;