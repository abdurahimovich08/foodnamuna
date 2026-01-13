import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminOrdersAPI } from '../api/adminClient';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/format';
import type { OrderWithItems } from '../types';

const STATUS_TRANSITIONS: Record<string, string[]> = {
  new: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivered'],
  delivered: [],
  cancelled: [],
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await adminOrdersAPI.get(id!);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (toStatus: string) => {
    if (!confirm(`Buyurtma holatini "${getStatusLabel(toStatus)}" ga o'zgartirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      setUpdating(true);
      await adminOrdersAPI.updateStatus(id!, toStatus);
      await loadOrder();
    } catch (error: any) {
      alert(error.message || 'Holatni yangilashda xatolik yuz berdi');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Buyurtma topilmadi</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Buyurtmalar ro'yxatiga qaytish
        </button>
      </div>
    );
  }

  const allowedTransitions = STATUS_TRANSITIONS[order.status] || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buyurtma #{order.id.slice(0, 8)}</h1>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Orqaga
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Buyurtma ma'lumotlari</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Holat:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telefon:</span>
                <span className="text-gray-900">{order.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rejim:</span>
                <span className="text-gray-900">
                  {order.delivery_mode === 'delivery' ? 'Yetkazish' : 'Olib ketish'}
                </span>
              </div>
              {order.address && (
                <div>
                  <span className="text-gray-600">Manzil: </span>
                  <span className="text-gray-900">{order.address}</span>
                </div>
              )}
              {order.comment && (
                <div>
                  <span className="text-gray-600">Izoh: </span>
                  <span className="text-gray-900">{order.comment}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Vaqt:</span>
                <span className="text-gray-900">{formatDate(order.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mahsulotlar</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      {item.item_comment && (
                        <p className="text-sm text-gray-500 italic mt-1">"{item.item_comment}"</p>
                      )}
                    </div>
                    <p className="font-semibold text-primary">{formatPrice(item.price * item.qty)}</p>
                  </div>
                  <p className="text-sm text-gray-600">Miqdor: {item.qty} × {formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Total */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Jami:</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Status Actions */}
          {allowedTransitions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Holatni o'zgartirish</h3>
              <div className="space-y-2">
                {allowedTransitions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      status === 'cancelled'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
