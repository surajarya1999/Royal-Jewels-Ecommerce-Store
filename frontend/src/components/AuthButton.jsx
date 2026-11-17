// src/components/AuthButton.jsx
import { useState, useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser } from '../services/firebase';
import { LogOut, Loader2 } from 'lucide-react';
import API from '../services/api';

export default function AuthButton() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Mobile redirect login ke baad result catch karne ke liye
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    alert(`✨ Welcome to Royal Jewels, ${result.user.displayName}!`);
                }
            })
            .catch((err) => {
                console.log("Redirect auth check:", err.message);
            });

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    await API.post('/users/sync', {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL
                    });
                } catch (err) {
                    console.log("User backend sync skipped/error:", err.message);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const user = await loginWithGoogle();
            // Popup login success par user object return hoga (redirect par page reload hota hai)
            if (user) {
                alert(`✨ Welcome to Royal Jewels, ${user.displayName}!`);
            }
        } catch (error) {
            alert(`❌ Login Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            alert("👋 Logged out from Royal Jewels successfully!");
        } catch (error) {
            alert("❌ Logout Error");
        }
    };

    return (
        <div className="shrink-0">
            {currentUser ? (
                <div className="flex items-center gap-2 sm:gap-2.5 bg-[#2B040B] text-[#D4AF37] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#D4AF37]/40 shadow-sm">
                    <img
                        src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'RJ')}&background=D4AF37&color=2B040B`}
                        alt={currentUser.displayName || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#D4AF37] object-cover shrink-0"
                    />
                    <span className="text-[11px] sm:text-xs font-serif font-bold max-w-[90px] lg:max-w-[120px] truncate hidden sm:inline">
                        {currentUser.displayName}
                    </span>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        aria-label="Logout"
                        className="text-[#D4AF37] hover:text-white active:scale-95 transition p-1 bg-transparent border-none cursor-pointer flex items-center"
                    >
                        <LogOut size={14} className="sm:w-[15px] sm:h-[15px]" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="bg-white border border-[#D4AF37] text-[#2B040B] hover:bg-[#FAF8F5] active:scale-[0.98] text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                >
                    {loading ? (
                        <Loader2 size={14} className="animate-spin text-[#2B040B]" />
                    ) : (
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                        />
                    )}
                    <span className="font-serif sm:hidden">Sign In</span>
                    <span className="font-serif hidden sm:inline">Continue with Google</span>
                </button>
            )}
        </div>
    );
}