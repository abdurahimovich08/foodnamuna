import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useAppStore } from '../stores/useAppStore';
import { createOrder } from '../utils/api';
import { formatPrice } from '@foodnamuna/shared';
import { getTelegramWebApp } from '../utils/telegram';
import { getBranches } from '../utils/api';
import { Branch } from '@foodnamuna/shared';

const RESTAURANT_ID = import.meta.env.VITE_RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { deliveryMode } = useAppStore();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pickupBranchId, setPickupBranchId] = useState('');
  const [comment, setComment] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  useEffect(() => {
    if (deliveryMode === 'pickup') {
      loadBranches();
    }
  }, [deliveryMode]);

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      const data = await getBranches(RESTAURANT_ID);
      setBranches(data);
    } catch (error) {
      console.error('Failed to load branches:', error);
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Savat bo\'sh');
      return;
    }

    if (!phone) {
      alert('Telefon raqamni kiriting');
      return;
    }

    if (deliveryMode === 'delivery' && !address) {
      alert('Manzilni kiriting');
      return;
    }

    const tg = getTelegramWebApp();
    if (!tg?.initData) {
      alert('Telegram autentifikatsiya talab qilinadi');
      return;
    }

    try {
      setLoading(true);
      await createOrder(
        {
          delivery_mode: deliveryMode,
          phone,
          address: deliveryMode === 'delivery' ? address : undefined,
          pickup_branch_id: deliveryMode === 'pickup' ? pickupBranchId : undefined,
          comment,
          items,
        },
        tg.initData
      );

      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Buyurtma yaratishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const total = getTotal();

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Buyurtma berish</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefon raqam *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998901234567"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {deliveryMode === 'delivery' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manzil *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="To'liq manzilni kiriting"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filial (ixtiyoriy)
            </label>
            {loadingBranches ? (
              <div className="text-gray-500">Yuklanmoqda...</div>
            ) : (
              <select
                value={pickupBranchId}
                onChange={(e) => setPickupBranchId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Filialni tanlang</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.title} - {branch.address}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Izoh (ixtiyoriy)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Qo'shimcha izoh..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">To'lov usuli</span>
            <span className="font-medium">Naqd</span>
          </div>
        </div>

        <div className="sticky bottom-20 bg-white border-t border-gray-200 p-4 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-500">Jami</span>
              <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Buyurtma berilmoqda...' : 'Buyurtma berish'}
          </button>
        </div>
      </form>
    </div>
  );
}
