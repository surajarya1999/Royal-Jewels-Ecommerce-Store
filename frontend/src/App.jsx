// src/App.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CelebrityGlam from './components/CelebrityGlam';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DeliveryTracker from './components/DeliveryTracker';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ProductCatalog from './components/ProductCatalog';
import ProfilePage from './components/Profile/ProfilePage';
import WishlistPage from './components/Profile/WishlistPage';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import CollectionsPage from './pages/CollectionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RoyalAIChatbot from './components/RoyalAIChatbot';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('royal_jewels_active_page') || 'home';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('royal_admin_auth') === 'true';
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('royal_jewels_cart') || '[]');
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('royal_jewels_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('royal_jewels_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('royal_jewels_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem('royal_jewels_active_page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.name === item.name);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
        };
        return updated;
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleProceedToCheckout = () => {
    handlePageChange('checkout');
  };

  // Toggle Wishlist (Add agar nahi hai, Remove agar pehle se hai)
  const handleAddToWishlistt = (item) => {
    setWishlistItems((prev) => {
      const exists = prev.some((i) => i.name === item.name);
      if (exists) {
        return prev.filter((i) => i.name !== item.name);
      }
      return [...prev, item];
    });
  };

  const handleRemoveWishlist = (indexToRemove) => {
    setWishlistItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOrderSuccess = (shippingData) => {
    setCompletedOrderDetails(shippingData);
    setCartItems([]);
    handlePageChange('tracking');
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* NAVBAR / HEADER */}
      {currentPage !== 'admin' && (
        <Navbar
          cartCount={cartItems.length}
          wishlistCount={wishlistItems.length}
          onOpenCart={() => handlePageChange('cart')}
          onOpenProfile={() => handlePageChange('profile')}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenWishlist={() => handlePageChange('wishlist')}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            handlePageChange('home');
          }}
          onNavigate={(page) => handlePageChange(page)}
        />
      )}

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* MAIN VIEWS SWITCHING */}
      <div className="flex-1">
        {currentPage === 'home' && (
          <main>
            <Home
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlistt}
            />
            <div id="celebs">
              <CelebrityGlam
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlistt}
              />
            </div>
            <div id="catalog">
              <ProductCatalog
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlistt}
                selectedCategory={selectedCategory}
                onNavigateToCollections={() => handlePageChange('collections')}
              />
            </div>
          </main>
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage
            wishlistItems={wishlistItems}
            onAddToCart={handleAddToCart}
            onRemoveWishlist={handleRemoveWishlist}
            onBackToShop={() => handlePageChange('home')}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleProceedToCheckout}
            onBackToShop={() => handlePageChange('home')}
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsPage
            onAddToCart={handleAddToCart}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handlePageChange('home');
            }}
          />
        )}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'profile' && (
          <ProfilePage
            onBackToShop={() => handlePageChange('home')}
            wishlistItems={wishlistItems}
            onRemoveWishlist={handleRemoveWishlist}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onBackToShop={() => handlePageChange('home')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'tracking' && (
          <DeliveryTracker
            orderDetails={completedOrderDetails}
            onBackHome={() => handlePageChange('home')}
          />
        )}

        {currentPage === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              onBackToStore={() => {
                sessionStorage.removeItem('royal_admin_auth');
                setIsAdminAuthenticated(false);
                handlePageChange('home');
              }}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={() => setIsAdminAuthenticated(true)}
              onBackToStore={() => handlePageChange('home')}
            />
          )
        )}
      </div>

      {/* FLOATING AI CONCIERGE CHATBOT (Visible only outside Admin view) */}
      {currentPage !== 'admin' && <RoyalAIChatbot />}

      {/* FOOTER */}
      {currentPage !== 'admin' && <Footer onNavigate={(page) => handlePageChange(page)} />}

    </div>
  );
}

export default App;