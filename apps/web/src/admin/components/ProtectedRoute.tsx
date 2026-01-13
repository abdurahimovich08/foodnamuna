import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('owner' | 'manager' | 'operator')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { admin, loading, initialized, checkAuth } = useAdminAuthStore();

  useEffect(() => {
    if (!initialized) {
      checkAuth();
    }
  }, [initialized, checkAuth]);

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (admin.must_change_password && location.pathname !== '/admin/settings') {
    return <Navigate to="/admin/settings?tab=password" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">403</h1>
          <p className="text-gray-600">Sizda bu sahifaga kirish huquqi yo'q</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
