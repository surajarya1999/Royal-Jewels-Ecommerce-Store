// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, ShieldCheck } from "lucide-react";
import { auth, loginWithGoogle } from "../services/firebase";

export default function Navbar({
    cartCount = 0,
    wishlistCount = 0,
    onOpenCart,
    onOpenProfile,
    onOpenSearch,
    onOpenWishlist,
    onSelectCategory,
    onNavigate
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Track Firebase Auth State
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    // Profile Click Handler
    const handleProfileClick = async () => {
        if (!currentUser) {
            try {
                setLoading(true);
                const user = await loginWithGoogle();
                alert(`✨ Welcome to Royal Jewels, ${user.displayName}!`);
            } catch (error) {
                alert(`❌ Login Failed: ${error.message}`);
            } finally {
                setLoading(false);
            }
        } else {
            if (onOpenProfile) onOpenProfile();
        }
    };

    const handleTopCategoryClick = (category, sectionId) => {
        setIsOpen(false);
        if (onSelectCategory) {
            onSelectCategory(category);
        }
        if (onNavigate) {
            onNavigate('home');
        }
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 150);
    };

    return (
        <header className="sticky top-0 z-50 bg-[#2B040B] text-[#FAF8F5] border-b border-[#D4AF37]/30 shadow-md w-full">
            {/* Top Bar */}
            <div className="bg-[#4A0A17] text-[#D4AF37] text-[10px] sm:text-xs py-1.5 text-center font-medium tracking-wide border-b border-[#D4AF37]/20 overflow-hidden whitespace-nowrap">
                <marquee scrollamount="5" className="w-full">
                    ✨ Free Express Shipping Across India &nbsp;&nbsp;|&nbsp;&nbsp; 22K Micro Gold-Plated &amp; American Diamond (AD) Replica Jewellery &nbsp;&nbsp;|&nbsp;&nbsp; 👑 Exclusive Celebrity-Inspired Bridal Sets &nbsp;&nbsp;|&nbsp;&nbsp; 🛡️ Anti-Tarnish Shine &amp; 7-Day Easy Replacement ✨
                </marquee>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-20 gap-1 sm:gap-2">

                    {/* Mobile Menu Icon (FIXED & RESTORED) */}
                    <div className="flex items-center md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[#D4AF37] p-2 focus:outline-none cursor-pointer bg-transparent border-none flex items-center justify-center"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>

                    {/* Royal Brand Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <button
                            type="button"
                            onClick={() => handleTopCategoryClick('All', 'top')}
                            className="flex flex-col items-center text-left group cursor-pointer bg-transparent border-none"
                        >
                            <span className="font-serif text-base sm:text-xl lg:text-2xl font-bold tracking-wider sm:tracking-widest text-[#D4AF37] group-hover:text-amber-300 transition duration-300 whitespace-nowrap">
                                ROYAL JEWELS
                            </span>
                            <span className="text-[6px] sm:text-[8px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-gray-300 -mt-1">
                                Bollywood Fine Collection
                            </span>
                        </button>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm font-medium tracking-wide">
                        <button
                            type="button"
                            onClick={() => handleTopCategoryClick('All', 'celebs')}
                            className="text-[#D4AF37] hover:text-white transition cursor-pointer bg-transparent border-none font-medium whitespace-nowrap flex items-center gap-1"
                        >
                            ⭐ Celebrity Looks
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTopCategoryClick('Necklaces', 'catalog')}
                            className="hover:text-[#D4AF37] transition cursor-pointer bg-transparent border-none font-medium whitespace-nowrap text-[#FAF8F5]"
                        >
                            Necklaces
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTopCategoryClick('Earrings', 'catalog')}
                            className="hover:text-[#D4AF37] transition cursor-pointer bg-transparent border-none font-medium whitespace-nowrap text-[#FAF8F5]"
                        >
                            Earrings
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTopCategoryClick('Rings', 'catalog')}
                            className="hover:text-[#D4AF37] transition cursor-pointer bg-transparent border-none font-medium whitespace-nowrap text-[#FAF8F5]"
                        >
                            Rings
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTopCategoryClick('Bridal', 'catalog')}
                            className="hover:text-[#D4AF37] transition cursor-pointer bg-transparent border-none font-medium whitespace-nowrap text-[#FAF8F5]"
                        >
                            Bridal
                        </button>
                        <div className="h-4 w-[1px] bg-[#D4AF37]/35 mx-0.5"></div>
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('collections')}
                            className="hover:text-[#D4AF37] transition whitespace-nowrap bg-transparent border-none cursor-pointer text-[#FAF8F5] text-xs lg:text-sm font-medium"
                        >
                            Collections
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('about')}
                            className="hover:text-[#D4AF37] transition whitespace-nowrap bg-transparent border-none cursor-pointer text-[#FAF8F5] text-xs lg:text-sm font-medium"
                        >
                            About
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('contact')}
                            className="hover:text-[#D4AF37] transition whitespace-nowrap bg-transparent border-none cursor-pointer text-[#FAF8F5] text-xs lg:text-sm font-medium"
                        >
                            Contact
                        </button>
                    </nav>

                    {/* Right Action Icons */}
                    <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
                        {/* Admin Icon */}
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('admin')}
                            title="Admin Dashboard"
                            className="hidden sm:flex items-center justify-center text-[#FAF8F5] hover:text-[#D4AF37] transition bg-transparent border-none cursor-pointer p-1"
                        >
                            <ShieldCheck size={18} className="sm:w-[19px] sm:h-[19px]" />
                        </button>

                        {/* Search Button */}
                        <button
                            type="button"
                            onClick={onOpenSearch}
                            className="flex items-center justify-center text-[#FAF8F5] hover:text-[#D4AF37] transition bg-transparent border-none cursor-pointer p-1"
                            title="Search Collection"
                        >
                            <Search size={18} className="sm:w-[19px] sm:h-[19px]" />
                        </button>

                        {/* PROFILE / GOOGLE AUTH BUTTON */}
                        <div className="relative flex items-center shrink-0">
                            {currentUser ? (
                                <button
                                    type="button"
                                    onClick={handleProfileClick}
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D4AF37] p-0.5 bg-[#4A0A17] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition shadow-md overflow-hidden touch-manipulation"
                                    title={`My Account (${currentUser.displayName || 'User'})`}
                                >
                                    {currentUser.photoURL ? (
                                        <img
                                            src={currentUser.photoURL}
                                            alt={currentUser.displayName || "Profile"}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="w-full h-full rounded-full bg-[#D4AF37] text-[#2B040B] font-bold text-xs flex items-center justify-center">
                                            {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleProfileClick}
                                    disabled={loading}
                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white hover:bg-gray-100 active:scale-95 rounded-full border border-[#D4AF37] transition shadow-md cursor-pointer touch-manipulation"
                                    title="Continue with Google"
                                >
                                    <img
                                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                                        alt="Google Sign In"
                                        className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none"
                                    />
                                </button>
                            )}
                        </div>

                        {/* Cart Button */}
                        <button
                            type="button"
                            onClick={onOpenCart}
                            className="relative bg-[#D4AF37] text-[#2B040B] p-2 sm:p-2.5 rounded-full hover:bg-amber-400 transition font-bold flex items-center justify-center shadow-lg border-none cursor-pointer shrink-0"
                            title="Shopping Bag"
                        >
                            <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-sans w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#2B040B]">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Drawer (FIXED & FULLY FUNCTIONAL) */}
            {isOpen && (
                <div className="md:hidden bg-[#2B040B] border-t border-[#D4AF37]/20 px-4 pt-3 pb-6 space-y-3 text-sm font-medium shadow-2xl">
                    <div className="flex justify-between items-center pb-2 border-b border-[#D4AF37]/25">
                        <span className="text-xs text-[#D4AF37] font-serif uppercase tracking-widest font-bold">Royal Menu</span>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); if (onOpenWishlist) onOpenWishlist(); }}
                            className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-bold bg-transparent border-none cursor-pointer"
                        >
                            Wishlist ({wishlistCount})
                        </button>
                    </div>

                    {/* Mobile Profile Section */}
                    <div className="py-2 border-b border-[#D4AF37]/25">
                        {currentUser ? (
                            <button
                                type="button"
                                onClick={() => { setIsOpen(false); handleProfileClick(); }}
                                className="w-full flex items-center justify-between bg-[#4A0A17] p-2.5 rounded-xl border border-[#D4AF37]/30 text-left cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    <img src={currentUser.photoURL} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-[#D4AF37] shrink-0 object-cover" />
                                    <div className="truncate">
                                        <p className="text-xs font-bold text-[#D4AF37] truncate">{currentUser.displayName}</p>
                                        <p className="text-[10px] text-gray-300 truncate">{currentUser.email}</p>
                                    </div>
                                </div>
                                <span className="text-[11px] text-[#D4AF37] underline font-bold shrink-0">View Profile</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => { setIsOpen(false); handleProfileClick(); }}
                                className="w-full bg-white text-[#2B040B] py-3 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer hover:bg-gray-50 transition"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                                Sign in with Google
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => handleTopCategoryClick('All', 'celebs')}
                        className="block w-full text-left text-[#D4AF37] py-1.5 bg-transparent border-none font-medium cursor-pointer"
                    >
                        ⭐ As Seen On Celebrities
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTopCategoryClick('Necklaces', 'catalog')}
                        className="block w-full text-left py-1.5 hover:text-[#D4AF37] bg-transparent border-none font-medium text-[#FAF8F5] cursor-pointer"
                    >
                        Necklaces & Sets
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTopCategoryClick('Earrings', 'catalog')}
                        className="block w-full text-left py-1.5 hover:text-[#D4AF37] bg-transparent border-none font-medium text-[#FAF8F5] cursor-pointer"
                    >
                        Earrings & Jhumkas
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTopCategoryClick('Rings', 'catalog')}
                        className="block w-full text-left py-1.5 hover:text-[#D4AF37] bg-transparent border-none font-medium text-[#FAF8F5] cursor-pointer"
                    >
                        Solitaire Rings
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTopCategoryClick('Bridal', 'catalog')}
                        className="block w-full text-left py-1.5 hover:text-[#D4AF37] bg-transparent border-none font-medium text-[#FAF8F5] cursor-pointer"
                    >
                        Bridal Heritage
                    </button>

                    <div className="border-t border-[#D4AF37]/20 my-2 pt-2 space-y-2">
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); if (onNavigate) onNavigate('collections'); }}
                            className="block w-full text-left py-1.5 hover:text-[#D4AF37] bg-transparent border-none text-[#FAF8F5] cursor-pointer font-medium"
                        >
                            ✨ All Collections
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); if (onNavigate) onNavigate('about'); }}
                            className="block w-full text-left py-1.5 hover:text-[#D4AF37] bg-transparent border-none text-[#FAF8F5] cursor-pointer font-medium"
                        >
                            📜 About Us & Heritage
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); if (onNavigate) onNavigate('contact'); }}
                            className="block w-full text-left py-1.5 hover:text-[#D4AF37] bg-transparent border-none text-[#FAF8F5] cursor-pointer font-medium"
                        >
                            📞 VIP Concierge / Contact
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => { setIsOpen(false); if (onNavigate) onNavigate('admin'); }}
                        className="flex items-center gap-2 text-[#D4AF37] py-2 font-bold border-t border-[#D4AF37]/20 mt-2 bg-transparent border-none cursor-pointer w-full text-left"
                    >
                        <ShieldCheck size={18} /> Admin Panel
                    </button>
                </div>
            )}
        </header>
    );
}