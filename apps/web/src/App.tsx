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
      console.log('[App] Telegram WebApp found, initData:', initData ? 'present' : 'missing');
      
      if (initData) {
        verifyTelegramAuth(initData)
          .then((user) => {
            console.log('[App] Telegram auth result:', user ? 'success' : 'failed', user);
            if (user) {
              setUser(user);
              setAuthStatus('authenticated');
            } else {
              setAuthStatus('unauthenticated');
            }
          })
          .catch((error) => {
            console.error('[App] Telegram auth error:', error);
            setAuthStatus('unauthenticated');
          });
      } else {
        console.log('[App] No initData, setting unauthenticated');
        setAuthStatus('unauthenticated');
      }
    } else {
      // Development mode - no Telegram WebApp
      console.log('[App] Development mode: Telegram WebApp not found');
      
      // For development: Check if we should use mock user
      const devTelegramId = import.meta.env.VITE_DEV_TELEGRAM_ID;
      if (devTelegramId && import.meta.env.DEV) {
        console.log('[App] Development mode: Using mock user with telegram_id:', devTelegramId);
        // Create mock user for development
        const mockUser = {
          tg_id: parseInt(devTelegramId, 10),
          username: 'dev_user',
          first_name: 'Development',
          last_name: 'User',
        };
        setUser(mockUser);
        setAuthStatus('authenticated');
      } else {
        console.log('[App] Development mode: No mock user configured');
        setAuthStatus('unauthenticated');
      }
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
