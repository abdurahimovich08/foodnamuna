import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  deliveryMode: 'delivery' | 'pickup';
  sortBy: 'name_asc' | 'name_desc' | 'rating' | 'price_asc' | 'price_desc';
  selectedTags: string[];
  setDeliveryMode: (mode: 'delivery' | 'pickup') => void;
  setSortBy: (sort: 'name_asc' | 'name_desc' | 'rating' | 'price_asc' | 'price_desc') => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      deliveryMode: 'delivery',
      sortBy: 'name_asc',
      selectedTags: [],
      setDeliveryMode: (mode) => set({ deliveryMode: mode }),
      setSortBy: (sort) => set({ sortBy: sort }),
      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),
      clearFilters: () => set({ sortBy: 'name_asc', selectedTags: [] }),
    }),
    {
      name: 'app-storage',
    }
  )
);
