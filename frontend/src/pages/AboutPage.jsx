// src/pages/AboutPage.jsx
import { Sparkles, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="bg-[#FAF8F5] min-h-screen py-12 md:py-16 px-4 md:px-16 text-[#2B040B] space-y-14 md:space-y-20 antialiased selection:bg-[#D4AF37] selection:text-[#2B040B]">

            {/* Intro Header */}
            <div className="max-w-4xl mx-auto text-center space-y-5">
                <span className="bg-[#2B040B] text-[#D4AF37] border border-[#D4AF37]/50 px-5 sm:px-6 py-2 rounded-full text-[10px] sm:text-[11px] font-serif font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase inline-flex items-center gap-2 shadow-sm">
                    <Sparkles size={13} /> The Art of Accessible Luxury <Sparkles size={13} />
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight text-[#2B040B]">
                    Where Royal Cinema Glamour <br />
                    <span className="italic font-normal text-amber-800">Meets Everyday Elegance.</span>
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto">
                    Royal Jewels brings centuries of royal Indian heritage and red-carpet Bollywood aesthetics to life through exquisite, lightweight, and skin-friendly premium replica masterpieces.
                </p>
            </div>

            {/* Legacy Story Section */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white p-5 sm:p-8 md:p-14 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-4 sm:space-y-5 relative z-10">
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4AF37]">
                        Master Craftsmanship
                    </span>
                    <h2 className="font-serif text-2xl md:text-4xl font-bold text-[#2B040B] leading-snug">
                        The Karigars Behind Our Exquisite Masterpieces
                    </h2>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-light">
                        Every piece of Kundan, Polki, and American Diamond jewellery is meticulously crafted by generational artisans. Utilizing advanced micro-plating and anti-tarnish techniques, we deliver the exact majestic look of heavy royal gold without the weight or exorbitant cost.
                    </p>
                    <div className="pt-2 sm:pt-3 grid grid-cols-2 gap-4 sm:gap-6">
                        <div className="border-l-2 border-[#D4AF37] pl-3 sm:pl-4">
                            <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B040B]">Anti-Tarnish</h4>
                            <p className="text-gray-500 text-[11px] font-light">Micro Gold Plated Finish</p>
                        </div>
                        <div className="border-l-2 border-[#D4AF37] pl-3 sm:pl-4">
                            <h4 className="font-serif font-bold text-sm sm:text-base text-[#2B040B]">7-Day Policy</h4>
                            <p className="text-gray-500 text-[11px] font-light">Easy Replacement Guarantee</p>
                        </div>
                    </div>
                </div>

                {/* Responsive Image Container (Zero Cropping on Mobile & Desktop) */}
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 bg-[#FAF8F5] relative group">
                    <img
                        src="/ais3.png"
                        alt="Royal Craftsmanship"
                        className="w-full h-auto max-h-[420px] object-contain mx-auto block group-hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>

            {/* Value Badges */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-lg space-y-3 text-center hover:shadow-xl transition duration-300">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2B040B]">Skin-Friendly Base</h3>
                    <p className="text-gray-600 text-xs leading-relaxed font-light">
                        Crafted from hypoallergenic brass and alloy base, completely nickel-free and lead-free for sensitive skin.
                    </p>
                </div>

                <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-lg space-y-3 text-center hover:shadow-xl transition duration-300">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                        <Award size={28} />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2B040B]">Bollywood Red-Carpet</h3>
                    <p className="text-gray-600 text-xs leading-relaxed font-light">
                        Exclusive designer replica pieces inspired by blockbuster cinematic looks and high-end celebrity weddings.
                    </p>
                </div>

                <div className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-lg space-y-3 text-center hover:shadow-xl transition duration-300">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                        <HeartHandshake size={28} />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2B040B]">Bespoke Bridal Sets</h3>
                    <p className="text-gray-600 text-xs leading-relaxed font-light">
                        Curated complete bridal ensembles including choker, long haar, maang tikka, and jhumkas at accessible impulse prices.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default AboutPage;