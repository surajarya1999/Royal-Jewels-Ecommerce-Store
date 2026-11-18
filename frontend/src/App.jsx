// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
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
import { auth } from './services/firebase';

const VALID_PAGES = [
  'home',
  'wishlist',
  'cart',
  'collections',
  'about',
  'contact',
  'profile',
  'checkout',
  'tracking',
  'admin'
];

// URL hash ya localStorage se initial page nikalne ka helper
const getInitialPage = () => {
  const hashPage = window.location.hash.replace('#', '').trim();
  if (VALID_PAGES.includes(hashPage)) {
    return hashPage;
  }
  const savedPage = localStorage.getItem('royal_jewels_active_page');
  return VALID_PAGES.includes(savedPage) ? savedPage : 'home';
};

function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [userKey, setUserKey] = useState('guest');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('royal_admin_auth') === 'true';
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('royal_jewels_cart_guest') || '[]');
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('royal_jewels_wishlist_guest') || '[]');
    } catch {
      return [];
    }
  });

  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Firebase Auth listener: har logged-in user ke liye alag cart & wishlist load karein
  useEffect(() => {
    // Purana shared cart/wishlist clean karein taaki cross-account leak na ho
    localStorage.removeItem('royal_jewels_cart');
    localStorage.removeItem('royal_jewels_wishlist');

    const unsubscribe = auth.onAuthStateChanged((user) => {
      const nextKey = user?.email ? user.email.toLowerCase().trim() : 'guest';
      setUserKey(nextKey);

      try {
        const savedCart = JSON.parse(localStorage.getItem(`royal_jewels_cart_${nextKey}`) || '[]');
        const savedWishlist = JSON.parse(localStorage.getItem(`royal_jewels_wishlist_${nextKey}`) || '[]');
        setCartItems(Array.isArray(savedCart) ? savedCart : []);
        setWishlistItems(Array.isArray(savedWishlist) ? savedWishlist : []);
      } catch {
        setCartItems([]);
        setWishlistItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // User-specific cart & wishlist save karein
  useEffect(() => {
    localStorage.setItem(`royal_jewels_cart_${userKey}`, JSON.stringify(cartItems));
  }, [cartItems, userKey]);

  useEffect(() => {
    localStorage.setItem(`royal_jewels_wishlist_${userKey}`, JSON.stringify(wishlistItems));
  }, [wishlistItems, userKey]);

  // Initial load par browser history state set karein (taaki mobile back button home par ruk sake)
  useEffect(() => {
    const initial = getInitialPage();
    if (initial !== 'home') {
      // Base entry 'home' aur current entry active page rakhein taaki back dabane par 'home' aaye
      window.history.replaceState({ page: 'home' }, '', '#home');
      window.history.pushState({ page: initial }, '', `#${initial}`);
    } else {
      window.history.replaceState({ page: 'home' }, '', '#home');
    }

    const handlePopState = (event) => {
      const hashPage = window.location.hash.replace('#', '').trim();
      const targetPage =
        event.state?.page ||
        (VALID_PAGES.includes(hashPage) ? hashPage : 'home');

      setCurrentPage(targetPage);
      localStorage.setItem('royal_jewels_active_page', targetPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Step-by-step navigation handler (Push history + Refresh persistence)
  const handlePageChange = useCallback((page) => {
    const targetPage = VALID_PAGES.includes(page) ? page : 'home';

    setCurrentPage((prevPage) => {
      if (prevPage !== targetPage) {
        window.history.pushState({ page: targetPage }, '', `#${targetPage}`);
      }
      return targetPage;
    });

    localStorage.setItem('royal_jewels_active_page', targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Mobile-friendly Back handler (agar history hai toh step back, warna home)
  const handleSmartBack = useCallback(() => {
    if (window.history.length > 1 && currentPage !== 'home') {
      window.history.back();
    } else {
      handlePageChange('home');
    }
  }, [currentPage, handlePageChange]);

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

  // Toggle Wishlist
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
            onBackToShop={handleSmartBack}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleProceedToCheckout}
            onBackToShop={handleSmartBack}
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
            onBackToShop={handleSmartBack}
            wishlistItems={wishlistItems}
            onRemoveWishlist={handleRemoveWishlist}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onBackToShop={handleSmartBack}
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