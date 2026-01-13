import { create } from 'zustand';
import { Order, OrderWithItems } from '../types';
import { getOrders, getOrder } from '../utils/api';
import { getTelegramWebApp } from '../utils/telegram';

interface OrdersState {
  orders: Order[];
  currentOrder: OrderWithItems | null;
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  clearCurrentOrder: () => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const tg = getTelegramWebApp();
      if (!tg?.initData) {
        throw new Error('Telegram auth required');
      }
      const orders = await getOrders(tg.initData);
      set({ orders, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  fetchOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const tg = getTelegramWebApp();
      if (!tg?.initData) {
        throw new Error('Telegram auth required');
      }
      const order = await getOrder(id, tg.initData);
      set({ currentOrder: order, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  clearCurrentOrder: () => set({ currentOrder: null }),
}));
