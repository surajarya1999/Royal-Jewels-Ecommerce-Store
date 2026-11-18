// src/components/Home.jsx
import { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const heroSliderData = [
    {
        id: 1,
        title: "Deepika's Royal Heritage Collection",
        subtitle: "Handcrafted 22K Gold-Plated Uncut Kundan & Emerald Replica",
        image: "/h1l.png",         // Desktop / Landscape Image
        mobileImage: "/m.png",   // Mobile portrait image path
        badge: "Celebrity Replica Edition",
        tag: "Royal Couture"
    },
    {
        id: 2,
        title: "Aneet's Regal Bridal Statement",
        subtitle: "Micro Gold-Plated Antique Finish & Pearl Craftsmanship",
        image: "/h2.png",
        mobileImage: "/mn.png",
        badge: "Royal Wedding Replica",
        tag: "Bridal Heritage"
    },
    {
        id: 3,
        title: "Bollywood Diva's Diamond Glamour",
        subtitle: "Exclusive American Diamond & Emerald Choker Masterpiece",
        image: "/h3.png",
        mobileImage: "/y3.png",
        badge: "Bollywood Cinema Special",
        tag: "Luxury Edition"
    }
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play slider every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSliderData.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? heroSliderData.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSliderData.length);
    };

    return (
        <div className="bg-[#FAF8F5] text-gray-900 font-sans w-full overflow-hidden antialiased">

            {/* 1. TOP ANNOUNCEMENT BANNER */}
            <div className="bg-[#2B040B] text-[#FAF8F5] py-4 px-4 text-center border-b border-[#D4AF37]/30">
                <span className="text-[#D4AF37] font-serif text-xs md:text-sm uppercase tracking-[0.3em] font-semibold flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Bollywood Royal Fashion &amp; Replica Jewelry 2026 <Sparkles size={16} />
                </span>
            </div>

            {/* 2. FULL-WIDTH HERO SLIDER SECTION */}
            <div className="relative w-full h-[550px] md:h-[600px] bg-[#2B040B] overflow-hidden">
                {heroSliderData.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                    >
                        {/* Desktop / Landscape Image */}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="hidden md:block w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-linear"
                        />

                        {/* Mobile / Portrait Image */}
                        <img
                            src={slide.mobileImage || slide.image}
                            alt={slide.title}
                            className="block md:hidden w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-linear"
                        />

                        {/* Royal Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2B040B]/80 via-transparent to-[#2B040B]/80"></div>

                        {/* Slider Content */}
                        <div className="absolute inset-0 flex items-end md:items-center justify-start max-w-7xl mx-auto px-6 md:px-16 pb-16 md:pb-0 z-20">
                            <div className="text-white space-y-4 max-w-2xl">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#D4AF37] text-[#2B040B] font-bold text-[10px] md:text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                                        {slide.badge}
                                    </span>
                                    <span className="bg-[#4A0A17] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] md:text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
                                        {slide.tag}
                                    </span>
                                </div>
                                <h1 className="font-serif text-3xl md:text-6xl font-bold text-[#FAF8F5] leading-tight drop-shadow-md">
                                    {slide.title}
                                </h1>
                                <p className="text-sm md:text-lg text-amber-100/90 font-light max-w-xl font-serif italic">
                                    {slide.subtitle}
                                </p>
                                <div className="pt-4 flex items-center gap-4">
                                    <a
                                        href="#celebs"
                                        className="bg-[#D4AF37] text-[#2B040B] font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-2xl flex items-center gap-2 cursor-pointer"
                                    >
                                        Explore Glamour ✨
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Left Navigation Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-[#2B040B]/60 hover:bg-[#D4AF37] hover:text-[#2B040B] text-[#D4AF37] p-3 md:p-4 rounded-full transition backdrop-blur-md border border-[#D4AF37]/40 shadow-xl cursor-pointer"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Right Navigation Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-[#2B040B]/60 hover:bg-[#D4AF37] hover:text-[#2B040B] text-[#D4AF37] p-3 md:p-4 rounded-full transition backdrop-blur-md border border-[#D4AF37]/40 shadow-xl cursor-pointer"
                    aria-label="Next Slide"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Dots Navigation Indicator */}
                <div className="absolute bottom-6 right-6 md:right-16 z-30 flex gap-2">
                    {heroSliderData.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide ? 'w-10 bg-[#D4AF37]' : 'w-2.5 bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* 3. FEATURES TRUST INDICATORS BAR */}
            <div className="bg-[#4A0A17] text-[#FAF8F5] py-3.5 sm:py-4 px-4 border-y border-[#D4AF37]/30">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">

                    {/* 1. Anti-Tarnish Polish */}
                    <div className="flex items-center justify-start sm:justify-center gap-2.5">
                        <ShieldCheck className="text-[#D4AF37] shrink-0" size={22} />
                        <div className="text-left">
                            <h4 className="font-serif font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#D4AF37] leading-tight">
                                Anti-Tarnish Polish
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-gray-300 leading-tight mt-0.5">
                                22K Micro Gold-Plated Finish
                            </p>
                        </div>
                    </div>

                    {/* 2. Express Shipping */}
                    <div className="flex items-center justify-start sm:justify-center gap-2.5">
                        <Truck className="text-[#D4AF37] shrink-0" size={22} />
                        <div className="text-left">
                            <h4 className="font-serif font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#D4AF37] leading-tight">
                                Express Shipping
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-gray-300 leading-tight mt-0.5">
                                Free Secure Pan-India Delivery
                            </p>
                        </div>
                    </div>

                    {/* 3. Easy Replacement */}
                    <div className="flex items-center justify-start sm:justify-center gap-2.5">
                        <RefreshCw className="text-[#D4AF37] shrink-0" size={22} />
                        <div className="text-left">
                            <h4 className="font-serif font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#D4AF37] leading-tight">
                                Easy Replacement
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-gray-300 leading-tight mt-0.5">
                                7-Day Quality Guarantee
                            </p>
                        </div>
                    </div>

                    {/* 4. Master Craftsmanship */}
                    <div className="flex items-center justify-start sm:justify-center gap-2.5">
                        <Sparkles className="text-[#D4AF37] shrink-0" size={22} />
                        <div className="text-left">
                            <h4 className="font-serif font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#D4AF37] leading-tight">
                                Master Craftsmanship
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-gray-300 leading-tight mt-0.5">
                                Celebrity Replica Designs
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 4. ROYAL HERITAGE ARTISTRY INTRO */}
            <div className="py-14 px-4 text-center max-w-4xl mx-auto space-y-3">
                <Star className="text-[#D4AF37] mx-auto" size={26} />
                <h2 className="font-serif text-3xl font-bold text-[#2B040B]">The Legacy of Royal Replica Artistry</h2>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
                    Adorning iconic stars on red carpets and regal weddings. Explore handcrafted celebrity replica kundan, American diamonds, and traditional gold-plated masterpieces.
                </p>
            </div>

        </div>
    );
};

export default Home;