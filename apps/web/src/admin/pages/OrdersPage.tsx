import { useState, useEffect, useRef } from 'react';
import { adminOrdersAPI } from '../api/adminClient';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/format';
import OrderDetailDrawer from '../components/OrderDetailDrawer';
import type { Order } from '../types';

const POLL_INTERVAL = 10000; // 10 seconds

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const statuses = [
    { value: 'all', label: 'Barchasi' },
    { value: 'new', label: 'Yangi' },
    { value: 'preparing', label: 'Tayyorlanmoqda' },
    { value: 'ready', label: 'Tayyor' },
    { value: 'delivered', label: 'Yetkazildi' },
    { value: 'cancelled', label: 'Bekor qilindi' },
  ];

  const loadOrders = async () => {
    try {
      setLoading(true);
      if (selectedStatus === 'all') {
        const allOrders = await Promise.all([
          adminOrdersAPI.list('new'),
          adminOrdersAPI.list('preparing'),
          adminOrdersAPI.list('ready'),
          adminOrdersAPI.list('delivered'),
          adminOrdersAPI.list('cancelled'),
        ]);
        setOrders(allOrders.flat());
      } else {
        const data = await adminOrdersAPI.list(selectedStatus);
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // Set up polling
    intervalRef.current = setInterval(loadOrders, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedStatus]);

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.tg_id.toString().includes(query) ||
      order.tg_users?.username?.toLowerCase().includes(query) ||
      order.tg_users?.first_name?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buyurtmalar</h1>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
        >
          Yangilash
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="ID, TG ID yoki foydalanuvchi nomi bo'yicha qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Buyurtmalar topilmadi</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaqt</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mijoz</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejim</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jami</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">#{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.tg_users?.username || order.tg_users?.first_name || `TG:${order.tg_id}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.delivery_mode === 'delivery' ? 'Yetkazish' : 'Olib ketish'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Batafsil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={loadOrders}
        />
      )}
    </div>
  );
}
