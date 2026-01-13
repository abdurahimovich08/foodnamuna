import { useState, useEffect } from 'react';
import { adminCategoriesAPI } from '../api/adminClient';
import CategoryModal from '../components/CategoryModal';
import type { Category } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminCategoriesAPI.list();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kategoriyani o\'chirishni tasdiqlaysizmi?')) {
      return;
    }

    try {
      await adminCategoriesAPI.delete(id);
      await loadCategories();
    } catch (error: any) {
      alert(error.message || 'O\'chirishda xatolik yuz berdi');
    }
  };

  const handleSave = async () => {
    await loadCategories();
    setModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kategoriyalar</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
        >
          + Yangi kategoriya
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sort</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harakatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{category.sort}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.title}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => {
            setModalOpen(false);
            setSelectedCategory(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
