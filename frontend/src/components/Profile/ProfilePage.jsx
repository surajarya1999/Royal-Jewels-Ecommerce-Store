// src/components/Profile/ProfilePage.jsx
import { useState } from 'react';
import { Package, User, LogOut, ArrowLeft, Heart } from 'lucide-react';
import OrderHistory from './OrderHistory';
import ProfileDetails from './ProfileDetails';
import WishlistPage from './WishlistPage';
import PropTypes from 'prop-types';
import { logoutUser } from '../../services/firebase';

const ProfilePage = ({
    onBackToShop,
    wishlistItems = [],
    onRemoveWishlist,
    onAddToCart
}) => {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'wishlist', 'details'

    const handleLogout = async () => {
        try {
            await logoutUser();
            alert('👋 You have been logged out successfully from Royal Jewels.');
            if (onBackToShop) onBackToShop();
        } catch (error) {
            console.error("Logout Error:", error);
            alert("❌ Logout Failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Back Button */}
                {onBackToShop && (
                    <button
                        onClick={onBackToShop}
                        className="flex items-center gap-2 text-xs font-bold text-[#2B040B] uppercase tracking-wider hover:text-[#D4AF37] transition cursor-pointer bg-transparent border-none"
                    >
                        <ArrowLeft size={16} /> Back to Store
                    </button>
                )}

                <h1 className="text-3xl font-serif font-bold text-[#2B040B]">Customer Dashboard</h1>

                {/* Layout Container */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1 bg-white p-4 rounded-2xl border border-[#EED9C4] shadow-sm h-fit space-y-2">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none ${activeTab === 'orders'
                                ? 'bg-[#2B040B] text-[#D4AF37]'
                                : 'text-gray-600 hover:bg-[#FAF8F5] hover:text-[#2B040B]'
                                }`}
                        >
                            <Package size={16} /> My Orders
                        </button>

                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none ${activeTab === 'wishlist'
                                ? 'bg-[#2B040B] text-[#D4AF37]'
                                : 'text-gray-600 hover:bg-[#FAF8F5] hover:text-[#2B040B]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Heart size={16} /> My Wishlist
                            </div>
                            {wishlistItems.length > 0 && (
                                <span className="bg-[#D4AF37] text-[#2B040B] text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('details')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none ${activeTab === 'details'
                                ? 'bg-[#2B040B] text-[#D4AF37]'
                                : 'text-gray-600 hover:bg-[#FAF8F5] hover:text-[#2B040B]'
                                }`}
                        >
                            <User size={16} /> Profile Details
                        </button>

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition cursor-pointer bg-transparent border-none"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        {activeTab === 'orders' && <OrderHistory />}
                        {activeTab === 'details' && <ProfileDetails />}
                        {activeTab === 'wishlist' && (
                            <WishlistPage
                                wishlistItems={wishlistItems}
                                onAddToCart={onAddToCart}
                                onRemoveWishlist={onRemoveWishlist}
                                onBackToShop={onBackToShop}
                                isEmbedded={true}
                            />
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

ProfilePage.propTypes = {
    onBackToShop: PropTypes.func,
    wishlistItems: PropTypes.array,
    onRemoveWishlist: PropTypes.func,
    onAddToCart: PropTypes.func
};

export default ProfilePage;