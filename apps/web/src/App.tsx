import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import PromosPage from './pages/PromosPage';
import BranchesPage from './pages/BranchesPage';
import ContactsPage from './pages/ContactsPage';
import LanguagePage from './pages/LanguagePage';
import AdminApp from './admin/app/AdminApp';
import { useUserStore } from './stores/useUserStore';
import { verifyTelegramAuth } from './utils/telegram';

function App() {
  const { setUser, setAuthStatus } = useUserStore();

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Verify and set user
      const initData = tg.initData;
      if (initData) {
        verifyTelegramAuth(initData)
          .then((user) => {
            if (user) {
              setUser(user);
              setAuthStatus('authenticated');
            } else {
              setAuthStatus('unauthenticated');
            }
          })
          .catch(() => {
            setAuthStatus('unauthenticated');
          });
      } else {
        setAuthStatus('unauthenticated');
      }
    } else {
      // Development mode - no Telegram
      setAuthStatus('unauthenticated');
    }
  }, [setUser, setAuthStatus]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Mini App routes */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/promos" element={<PromosPage />} />
                <Route path="/branches" element={<BranchesPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/language" element={<LanguagePage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
