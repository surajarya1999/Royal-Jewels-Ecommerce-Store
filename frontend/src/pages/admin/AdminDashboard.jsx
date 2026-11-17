// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BarChart3,
  PlusCircle,
  Grid,
  CreditCard,
  Mail,
  Menu,
  X,
  Crown,
  Loader2,
  Package
} from 'lucide-react';
import axios from 'axios';

// Dedicated Component Imports
import AddJewelry from './AddJewelry';
import AdminPayments from './AdminPayments';
import AdminContact from './AdminContact';
import ManageCatalog from './ManageCatalog';
import AdminOrders from './AdminOrders';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminDashboard = ({ onBackToStore }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dynamic Metrics States
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingInquiries: 0
  });

  // Fetch real-time analytics data
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        let orders = [];
        let products = [];
        let contacts = [];

        // 1. Fetch Orders / Revenue (Backend + LocalStorage Fallback)
        try {
          const resOrders = await axios.get(`${API_URL}/api/orders`);
          orders = resOrders.data.orders || resOrders.data || [];
        } catch {
          console.log('Backend orders offline, falling back to localStorage');
        }

        const localOrders = JSON.parse(localStorage.getItem('royal_jewels_orders') || '[]');
        const combinedOrders = [...localOrders, ...orders];
        // Unique orders based on ID
        orders = Array.from(new Map(combinedOrders.map((o) => [o.orderId || o._id, o])).values());

        // 2. Fetch Products
        try {
          const resProducts = await axios.get(`${API_URL}/api/products`);
          products = resProducts.data.products || resProducts.data || [];
        } catch {
          products = JSON.parse(localStorage.getItem('royal_jewels_products') || '[]');
        }

        // 3. Fetch Contacts / Inquiries
        try {
          const resContacts = await axios.get(`${API_URL}/api/contact`);
          contacts = resContacts.data.contacts || resContacts.data || [];
        } catch {
          contacts = [];
        }

        // Calculate Total Revenue
        const revenue = orders.reduce((acc, curr) => acc + Number(curr.amount || curr.totalPrice || 0), 0);

        // Calculate Pending Inquiries
        const pending = contacts.filter(c => c.status === 'Pending').length;

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          pendingInquiries: pending
        });
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchDashboardMetrics();
    const interval = setInterval(fetchDashboardMetrics, 15000); // Auto refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const navigationTabs = [
    { id: 'analytics', label: 'Executive Analytics', icon: <BarChart3 size={18} /> },
    { id: 'add-jewelry', label: 'Add New Jewelry', icon: <PlusCircle size={18} /> },
    { id: 'manage-catalog', label: 'Manage Catalog', icon: <Grid size={18} /> },
    { id: 'payments', label: 'Razorpay Payments', icon: <CreditCard size={18} /> },
    { id: 'support', label: 'Concierge Inbox', icon: <Mail size={18} /> },
    { id: 'orders', label: 'Manage Orders', icon: <Package size={18} /> },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row text-[#2B040B] font-sans relative">

      {/* MOBILE TOP BAR WITH HAMBURGER TOGGLE */}
      <div className="md:hidden bg-[#2B040B] text-[#FAF8F5] px-4 py-3 flex items-center justify-between border-b border-[#D4AF37]/30 sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-[#D4AF37]" />
          <span className="font-serif font-bold text-sm tracking-widest text-[#D4AF37]">ROYAL ADMIN</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-[#D4AF37] p-1.5 focus:outline-none cursor-pointer bg-transparent border-none"
          aria-label="Toggle Navigation Drawer"
        >
          {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DESKTOP & MOBILE SIDEBAR NAV */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#2B040B] text-[#FDF6F0] p-5 sm:p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform shrink-0
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Logo & Header */}
          <div className="flex items-center justify-between mb-7 sm:mb-8">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <span className="text-xl sm:text-2xl">👑</span>
              <div>
                <h1 className="text-base sm:text-lg font-serif tracking-widest font-bold text-[#D4AF37] leading-none">ROYAL JEWELS</h1>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-sans">Admin Portal</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white cursor-pointer bg-transparent border-none p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 sm:space-y-2">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 font-medium text-xs tracking-wide cursor-pointer border-none ${activeTab === tab.id
                  ? 'bg-[#D4AF37] text-[#2B040B] font-bold shadow-lg border border-[#FAF8F5]/20'
                  : 'hover:bg-white/10 text-[#FDF6F0] bg-transparent'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-5 border-t border-white/10 space-y-3.5">
          <button
            onClick={onBackToStore}
            className="w-full bg-white/10 text-[#D4AF37] hover:bg-white/20 text-xs font-bold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30"
          >
            <ArrowLeft size={14} /> Back to Customer Store
          </button>
          <div className="text-[10px] text-[#D4AF37]/80 text-center font-mono">
            Royal Jewels Engine v3.0
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* ADMIN MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col justify-between p-3.5 sm:p-6 md:p-8 lg:p-10 overflow-y-auto max-w-full min-h-[calc(100vh-52px)] md:min-h-screen">
        <div>
          {/* Header Ribbon */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs border border-[#EED9C4]">
            <div>
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#2B040B]">Executive Control Center</h2>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Realtime catalog management & payment synchronization</p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Storefront Operational
            </span>
          </header>

          {/* 1. EXECUTIVE ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-5 sm:space-y-6">
              {metricsLoading ? (
                <div className="bg-white p-12 sm:p-16 rounded-2xl sm:rounded-3xl border border-[#EED9C4] flex flex-col items-center justify-center text-[#2B040B]">
                  <Loader2 className="animate-spin mb-3 text-[#D4AF37]" size={32} />
                  <p className="text-xs font-serif font-bold">Syncing Executive Analytics...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">

                  {/* Total Revenue */}
                  <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs border border-[#EED9C4]">
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales Revenue</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#2B040B] mt-1.5 sm:mt-2">
                      ₹{stats.totalRevenue.toLocaleString('en-IN')}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold mt-1 inline-block">✓ Razorpay Synced</span>
                  </div>

                  {/* Total Verified Orders */}
                  <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs border border-[#EED9C4]">
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified Orders</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#2B040B] mt-1.5 sm:mt-2">
                      {stats.totalOrders}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold mt-1 inline-block">Processed Successfully</span>
                  </div>

                  {/* Total Live Products */}
                  <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs border border-[#EED9C4]">
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Products</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#2B040B] mt-1.5 sm:mt-2">
                      {stats.totalProducts} <span className="text-xs sm:text-sm font-normal text-gray-500">Pieces</span>
                    </h3>
                    <span className="text-[11px] sm:text-xs text-[#D4AF37] font-semibold mt-1 inline-block">Catalog Active</span>
                  </div>

                  {/* Pending VIP Inquiries */}
                  <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs border border-[#EED9C4]">
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">VIP Inquiries</p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-amber-700 mt-1.5 sm:mt-2">
                      {stats.pendingInquiries} Pending
                    </h3>
                    <span className="text-[11px] sm:text-xs text-gray-500 mt-1 inline-block">Requires concierge response</span>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* 2. DEDICATED ADD JEWELRY VIEW */}
          {activeTab === 'add-jewelry' && (
            <AddJewelry onProductAdded={() => setActiveTab('manage-catalog')} />
          )}

          {/* 3. DEDICATED CATALOG MANAGEMENT VIEW */}
          {activeTab === 'manage-catalog' && (
            <ManageCatalog />
          )}

          {/* 4. DEDICATED PAYMENTS AUDIT VIEW */}
          {activeTab === 'payments' && (
            <AdminPayments />
          )}

          {/* 5. DEDICATED SUPPORT CONCIERGE VIEW */}
          {activeTab === 'support' && (
            <AdminContact />
          )}

          {/* 6. MANAGE ORDERS VIEW */}
          {activeTab === 'orders' && (
            <AdminOrders />
          )}
        </div>

        {/* MINIMAL 1-LINE ADMIN FOOTER STRIP */}
        <footer className="mt-10 pt-4 pb-2 border-t border-[#EED9C4]/70 text-center">
          <p className="text-[11px] sm:text-xs text-gray-500 tracking-wide">
            © 2026 <span className="font-serif font-semibold text-[#2B040B]">Royal Jewels</span> Admin Portal • Secure Management System
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;