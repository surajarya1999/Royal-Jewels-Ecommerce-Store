
import { CheckCircle, Truck, PackageCheck, Sparkles, ArrowLeft } from 'lucide-react';

const DeliveryTracker = ({ orderDetails, onBackHome }) => {
    return (
        <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-[#EED9C4] text-center">

                <div className="w-16 h-16 bg-amber-50 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30 shadow-inner">
                    <Sparkles size={32} />
                </div>

                <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Order Confirmed Successfully
                </span>

                <h1 className="text-3xl font-serif font-bold text-[#2B040B] mt-3">Thank You For Your Purchase!</h1>
                <p className="text-gray-600 text-sm mt-1">
                    Your payment was successfully verified. Master artisans have started handcrafting your royal piece.
                </p>

                {/* Shipping details recap */}
                {orderDetails && (
                    <div className="my-6 p-4 bg-[#FAF8F5] rounded-xl border border-[#EED9C4] text-left text-xs space-y-1">
                        <p className="font-bold text-[#2B040B]">Ship To: {orderDetails.fullName}</p>
                        <p className="text-gray-600">{orderDetails.address}, {orderDetails.city} - {orderDetails.pincode}</p>
                        <p className="text-gray-600 font-mono">Phone: {orderDetails.phone}</p>
                    </div>
                )}

                {/* Live Tracking Timeline */}
                <div className="text-left my-8 border-t border-b border-[#EED9C4] py-6 space-y-6">
                    <h3 className="font-serif font-bold text-sm text-[#2B040B] uppercase tracking-wider">Live Order Status</h3>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#EED9C4]">

                        <div className="flex items-center space-x-4 relative">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center z-10 shadow">
                                <CheckCircle size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-[#2B040B]">Order Placed & Payment Verified</h4>
                                <p className="text-[11px] text-gray-500">Razorpay transaction ID verified successfully.</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 relative">
                            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#2B040B] flex items-center justify-center z-10 shadow animate-pulse">
                                <PackageCheck size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-[#2B040B]">Handcrafting & BIS Hallmarking</h4>
                                <p className="text-[11px] text-[#D4AF37] font-semibold">In Progress by Master Artisans</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 relative opacity-50">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center z-10">
                                <Truck size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-gray-700">Insured Dispatch & Delivery</h4>
                                <p className="text-[11px] text-gray-500">Expected delivery within 3-5 business days.</p>
                            </div>
                        </div>

                    </div>
                </div>

                <button
                    onClick={onBackHome}
                    className="bg-[#2B040B] text-[#D4AF37] font-bold px-8 py-3.5 rounded-xl hover:bg-[#4A0A17] transition shadow-md flex items-center justify-center gap-2 mx-auto text-sm"
                >
                    <ArrowLeft size={16} /> Return to Store Home
                </button>

            </div>
        </div>
    );
};

export default DeliveryTracker;