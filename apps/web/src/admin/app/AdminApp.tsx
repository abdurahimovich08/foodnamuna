import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import CategoriesPage from '../pages/CategoriesPage';
import ProductsPage from '../pages/ProductsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import SettingsPage from '../pages/SettingsPage';

export default function AdminApp() {
  const { checkAuth, initialized } = useAdminAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route
                  path="/menu/categories"
                  element={<ProtectedRoute allowedRoles={['owner', 'manager']}><CategoriesPage /></ProtectedRoute>}
                />
                <Route
                  path="/menu/products"
                  element={<ProtectedRoute allowedRoles={['owner', 'manager']}><ProductsPage /></ProtectedRoute>}
                />
                <Route
                  path="/admin-users"
                  element={<ProtectedRoute allowedRoles={['owner']}><AdminUsersPage /></ProtectedRoute>}
                />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
