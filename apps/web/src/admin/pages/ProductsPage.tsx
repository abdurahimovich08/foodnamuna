import { useState, useEffect } from 'react';
import { adminProductsAPI, adminCategoriesAPI } from '../api/adminClient';
import ProductModal from '../components/ProductModal';
import { formatPrice } from '../utils/format';
import type { Product, Category } from '../types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await adminCategoriesAPI.list();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const categoryId = selectedCategory === 'all' ? undefined : selectedCategory;
      const data = await adminProductsAPI.list(categoryId);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Mahsulotni o\'chirishni tasdiqlaysizmi?')) {
      return;
    }

    try {
      await adminProductsAPI.delete(id);
      await loadProducts();
    } catch (error: any) {
      alert(error.message || 'O\'chirishda xatolik yuz berdi');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await adminProductsAPI.update(product.id, { is_active: !product.is_active });
      await loadProducts();
    } catch (error: any) {
      alert(error.message || 'Yangilashda xatolik yuz berdi');
    }
  };

  const handleSave = async () => {
    await loadProducts();
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return product.title.toLowerCase().includes(query);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mahsulotlar</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
        >
          + Yangi mahsulot
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Barchasi</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qidirish</label>
            <input
              type="text"
              placeholder="Mahsulot nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const category = categories.find((c) => c.id === product.category_id);
            return (
              <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category?.title}</p>
                  <p className="text-lg font-bold text-primary mb-3">{formatPrice(product.price)}</p>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.is_active}
                        onChange={() => handleToggleActive(product)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {product.is_active ? 'Faol' : 'Nofaol'}
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          onClose={() => {
            setModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
