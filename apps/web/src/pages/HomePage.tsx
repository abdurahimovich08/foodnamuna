import { useState, useEffect } from 'react';
import { getMenu } from '../utils/api';
import { CategoryWithProducts, ProductWithAddons } from '@foodnamuna/shared';
import DeliveryModeSelect from '../components/DeliveryModeSelect';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid from '../components/ProductGrid';
import FilterSheet from '../components/FilterSheet';
import ScrollToTopFab from '../components/ScrollToTopFab';
import { useAppStore } from '../stores/useAppStore';
import { FunnelIcon } from '@heroicons/react/24/outline';

const RESTAURANT_ID = import.meta.env.VITE_RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { sortBy, selectedTags } = useAppStore();

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const menu = await getMenu(RESTAURANT_ID);
      setCategories(menu);
    } catch (error) {
      console.error('Failed to load menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = (): ProductWithAddons[] => {
    let products: ProductWithAddons[] = [];

    if (selectedCategoryId) {
      const category = categories.find((c) => c.id === selectedCategoryId);
      products = category?.products || [];
    } else {
      products = categories.flatMap((c) => c.products);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      products = products.filter((p) =>
        selectedTags.some((tag) => p.tags.includes(tag))
      );
    }

    // Sort
    products = [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'rating':
          return b.rating - a.rating;
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return products;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  const filteredProducts = getFilteredProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <DeliveryModeSelect />
        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-2 bg-white rounded-lg border border-gray-300"
        >
          <FunnelIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          Mahsulot topilmadi
        </div>
      )}

      <FilterSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      <ScrollToTopFab />
    </div>
  );
}
