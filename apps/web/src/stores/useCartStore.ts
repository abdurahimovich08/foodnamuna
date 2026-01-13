import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@foodnamuna/shared';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (productId: string, selectedAddons: string[]) => void;
  updateQuantity: (productId: string, selectedAddons: string[], qty: number) => void;
  updateItemComment: (productId: string, selectedAddons: string[], comment: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

function getItemKey(item: { product_id: string; selected_addons: string[] }): string {
  return `${item.product_id}_${item.selected_addons.sort().join(',')}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const key = getItemKey({ product_id: item.product_id, selected_addons: item.selected_addons });
        const existing = get().items.find(
          (i) => getItemKey(i) === key
        );
        
        if (existing) {
          get().updateQuantity(item.product_id, item.selected_addons, existing.qty + 1);
        } else {
          set((state) => ({
            items: [...state.items, { ...item, qty: 1 }],
          }));
        }
      },
      removeItem: (productId, selectedAddons) => {
        set((state) => ({
          items: state.items.filter(
            (item) => getItemKey(item) !== getItemKey({ product_id: productId, selected_addons: selectedAddons })
          ),
        }));
      },
      updateQuantity: (productId, selectedAddons, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, selectedAddons);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            getItemKey(item) === getItemKey({ product_id: productId, selected_addons: selectedAddons })
              ? { ...item, qty }
              : item
          ),
        }));
      },
      updateItemComment: (productId, selectedAddons, comment) => {
        set((state) => ({
          items: state.items.map((item) =>
            getItemKey(item) === getItemKey({ product_id: productId, selected_addons: selectedAddons })
              ? { ...item, item_comment: comment }
              : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + item.price * item.qty;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
