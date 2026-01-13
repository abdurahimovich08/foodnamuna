import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrdersStore } from '../stores/useOrdersStore';
import { formatPrice } from '@foodnamuna/shared';

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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrder, loading, error, fetchOrder } = useOrdersStore();

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id, fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Buyurtma topilmadi'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Buyurtmalar ro'yxatiga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Buyurtma #{currentOrder.id.slice(0, 8)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(currentOrder.created_at).toLocaleString('uz-UZ')}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[currentOrder.status] || statusColors.new}`}
          >
            {statusLabels[currentOrder.status] || currentOrder.status}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Telefon:</span>
            <span className="font-medium">{currentOrder.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rejim:</span>
            <span className="font-medium">
              {currentOrder.delivery_mode === 'delivery' ? 'Yetkazish' : 'Olib ketish'}
            </span>
          </div>
          {currentOrder.address && (
            <div className="flex justify-between">
              <span className="text-gray-600">Manzil:</span>
              <span className="font-medium text-right">{currentOrder.address}</span>
            </div>
          )}
          {currentOrder.comment && (
            <div>
              <span className="text-gray-600">Izoh: </span>
              <span className="font-medium">{currentOrder.comment}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Mahsulotlar</h3>
        <div className="space-y-3">
          {currentOrder.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                {item.item_comment && (
                  <p className="text-xs text-gray-500 italic mt-1">"{item.item_comment}"</p>
                )}
                <p className="text-sm text-gray-600 mt-1">Miqdor: {item.qty}</p>
              </div>
              <p className="font-semibold text-primary">
                {formatPrice(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Jami:</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(currentOrder.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
