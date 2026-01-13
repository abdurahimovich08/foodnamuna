import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrdersStore } from '../stores/useOrdersStore';
import { formatPrice } from '../utils/validators';

const statusLabels: Record<string, string> = {
  new: 'Yangi',
  preparing: 'Tayyorlanmoqda',
  ready: 'Tayyor',
  delivered: 'Yetkazildi',
  cancelled: 'Bekor qilindi',
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, loading, error, fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchOrders()}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Buyurtmalar mavjud emas</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Mahsulotlar sahifasiga o'tish
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <button
          key={order.id}
          onClick={() => navigate(`/orders/${order.id}`)}
          className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900">Buyurtma #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString('uz-UZ')}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || statusColors.new}`}
            >
              {statusLabels[order.status] || order.status}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {order.delivery_mode === 'delivery' ? 'Yetkazish' : 'Olib ketish'}
            </span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
