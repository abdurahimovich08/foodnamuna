import { useEffect, useState } from 'react';
import { adminOrdersAPI } from '../api/adminClient';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/format';
import type { Order } from '../types';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    new: 0,
    preparing: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
    total: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [newOrders, preparingOrders, readyOrders, deliveredOrders, cancelledOrders] = await Promise.all([
        adminOrdersAPI.list('new'),
        adminOrdersAPI.list('preparing'),
        adminOrdersAPI.list('ready'),
        adminOrdersAPI.list('delivered'),
        adminOrdersAPI.list('cancelled'),
      ]);

      const allOrders = [...newOrders, ...preparingOrders, ...readyOrders, ...deliveredOrders, ...cancelledOrders];
      const recent = allOrders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setStats({
        new: newOrders.length,
        preparing: preparingOrders.length,
        ready: readyOrders.length,
        delivered: deliveredOrders.length,
        cancelled: cancelledOrders.length,
        total: allOrders.length,
      });
      setRecentOrders(recent);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Yangi</p>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Tayyorlanmoqda</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.preparing}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Tayyor</p>
          <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Yetkazildi</p>
          <p className="text-2xl font-bold text-gray-600">{stats.delivered}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Bekor qilindi</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">Jami</p>
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">So'nggi buyurtmalar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mijoz</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jami</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaqt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.tg_users?.username || order.tg_users?.first_name || `TG:${order.tg_id}`}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

