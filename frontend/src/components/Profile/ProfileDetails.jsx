// src/components/Profile/ProfileDetails.jsx
import { useState, useEffect } from 'react';
import { User, Mail, Phone, ShieldCheck, Award } from 'lucide-react';
import { auth } from '../../services/firebase';

const ProfileDetails = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    // Fallback data agar user logged in na ho
    const displayName = currentUser?.displayName || 'Royal Guest';
    const email = currentUser?.email || 'Not Provided';
    const phone = currentUser?.phoneNumber || '+91 Not Linked';
    const photoURL = currentUser?.photoURL;

    // Firebase se account creation date nikalna (metadata)
    const creationTime = currentUser?.metadata?.creationTime
        ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'Recent';

    return (
        <div className="space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#2B040B] border-b border-[#EED9C4] pb-3 flex items-center gap-2">
                <User size={22} className="text-[#D4AF37]" /> Personal Profile Details
            </h2>

            <div className="bg-white p-8 rounded-2xl border border-[#EED9C4] shadow-sm space-y-6">

                {/* User Avatar & Tier Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-[#2B040B] text-[#D4AF37] flex items-center justify-center font-serif font-bold text-2xl shadow-md overflow-hidden border border-[#D4AF37]">
                        {photoURL ? (
                            <img
                                src={photoURL}
                                alt={displayName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            displayName.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg text-[#2B040B]">{displayName}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Award size={14} className="text-[#D4AF37]" /> Royal Elite Member • Joined {creationTime}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EED9C4] space-y-1">
                        <span className="text-gray-400 uppercase text-[10px] font-bold tracking-wider flex items-center gap-1">
                            <User size={12} className="text-[#D4AF37]" /> Full Name
                        </span>
                        <span className="font-bold text-[#2B040B] text-sm block">{displayName}</span>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EED9C4] space-y-1">
                        <span className="text-gray-400 uppercase text-[10px] font-bold tracking-wider flex items-center gap-1">
                            <Mail size={12} className="text-[#D4AF37]" /> Email Address
                        </span>
                        <span className="font-bold text-[#2B040B] text-sm block truncate">{email}</span>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EED9C4] space-y-1">
                        <span className="text-gray-400 uppercase text-[10px] font-bold tracking-wider flex items-center gap-1">
                            <Phone size={12} className="text-[#D4AF37]" /> Phone Number
                        </span>
                        <span className="font-bold text-[#2B040B] text-sm block">{phone}</span>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EED9C4] space-y-1">
                        <span className="text-gray-400 uppercase text-[10px] font-bold tracking-wider flex items-center gap-1">
                            <ShieldCheck size={12} className="text-[#D4AF37]" /> Account Security
                        </span>
                        <span className="font-bold text-emerald-700 text-sm block">Google Verified & Protected</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

ProfileDetails.propTypes = {};

export default ProfileDetails;