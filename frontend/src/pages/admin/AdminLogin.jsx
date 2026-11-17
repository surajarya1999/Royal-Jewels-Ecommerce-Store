// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { Crown, Lock, User, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import API from '../../services/api';

const AdminLogin = ({ onLoginSuccess, onBackToStore }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await API.post('/admin/login', {
                email: username,
                password: password
            });

            if (response.data.success) {
                sessionStorage.setItem('royal_admin_auth', 'true');
                onLoginSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Admin ID or Password. Access Denied.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-white border border-[#EED9C4] text-xs sm:text-sm placeholder:text-xs placeholder-gray-400 text-[#2B040B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition";

    return (
        <div className="min-h-screen bg-[#2B040B] flex items-center justify-center px-3.5 py-8 sm:p-6 relative overflow-hidden font-sans">
            {/* Ambient Gold Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[500px] sm:h-[500px] bg-[#D4AF37]/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

            <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl border border-[#D4AF37]/50 sm:border-2 relative z-10">
                {/* Header */}
                <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-[#2B040B] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg">
                        <Crown size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#9E6D68] block pt-1.5">
                        Restricted Concierge Portal
                    </span>
                    <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#2B040B]">
                        Royal Admin Login
                    </h2>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-4 sm:mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] sm:text-xs font-semibold text-center leading-relaxed">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2B040B] mb-1">
                            Admin Email / ID
                        </label>
                        <div className="relative">
                            <User size={15} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin@royaljewels.in"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2B040B] mb-1">
                            Security Password
                        </label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                className={inputClass}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2B040B] cursor-pointer bg-transparent border-none p-1"
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2B040B] text-[#D4AF37] font-serif font-bold py-3 sm:py-3.5 rounded-xl text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:bg-[#4A0A17] active:scale-[0.99] transition shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 border border-[#D4AF37]/30 mt-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={15} />}
                        {loading ? 'Authenticating...' : 'Unlock Dashboard'}
                    </button>
                </form>

                {/* Back to Store Link */}
                {onBackToStore && (
                    <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-[#EED9C4]/70 text-center">
                        <button
                            type="button"
                            onClick={onBackToStore}
                            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 hover:text-[#2B040B] font-medium cursor-pointer bg-transparent border-none transition"
                        >
                            <ArrowLeft size={13} /> Return to Storefront
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;