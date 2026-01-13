import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { adminOrdersAPI } from '../api/adminClient';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/format';
import type { Order, OrderWithItems } from '../types';

interface OrderDetailDrawerProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: () => void;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  new: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivered'],
  delivered: [],
  cancelled: [],
};

export default function OrderDetailDrawer({ order, onClose, onStatusUpdate }: OrderDetailDrawerProps) {
  const [orderDetail, setOrderDetail] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrderDetail();
  }, [order.id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await adminOrdersAPI.get(order.id);
      setOrderDetail(data);
    } catch (error) {
      console.error('Failed to load order detail:', error);
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
      await adminOrdersAPI.updateStatus(order.id, toStatus);
      await loadOrderDetail();
      onStatusUpdate();
    } catch (error: any) {
      alert(error.message || 'Holatni yangilashda xatolik yuz berdi');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6">
          <div className="text-gray-500">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return null;
  }

  const allowedTransitions = STATUS_TRANSITIONS[orderDetail.status] || [];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Buyurtma tafsilotlari</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Buyurtma ma'lumotlari</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-gray-900">#{orderDetail.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Holat:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderDetail.status)}`}>
                  {getStatusLabel(orderDetail.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telefon:</span>
                <span className="text-gray-900">{orderDetail.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rejim:</span>
                <span className="text-gray-900">
                  {orderDetail.delivery_mode === 'delivery' ? 'Yetkazish' : 'Olib ketish'}
                </span>
              </div>
              {orderDetail.address && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Manzil:</span>
                  <span className="text-gray-900 text-right">{orderDetail.address}</span>
                </div>
              )}
              {orderDetail.comment && (
                <div>
                  <span className="text-gray-600">Izoh: </span>
                  <span className="text-gray-900">{orderDetail.comment}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Vaqt:</span>
                <span className="text-gray-900">{formatDate(orderDetail.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Mahsulotlar</h3>
            <div className="space-y-2">
              {orderDetail.items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      {item.item_comment && (
                        <p className="text-sm text-gray-500 italic mt-1">"{item.item_comment}"</p>
                      )}
                    </div>
                    <p className="font-semibold text-primary">{formatPrice(item.price * item.qty)}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Miqdor: {item.qty} × {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Jami:</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(orderDetail.total)}</span>
            </div>
          </div>

          {/* Status Actions */}
          {allowedTransitions.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Holatni o'zgartirish</h3>
              <div className="flex gap-2">
                {allowedTransitions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
