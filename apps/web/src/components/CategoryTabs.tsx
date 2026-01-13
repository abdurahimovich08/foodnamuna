import { CategoryWithProducts } from '../types';

interface CategoryTabsProps {
  categories: CategoryWithProducts[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="mb-4 overflow-x-auto">
      <div className="flex gap-2 pb-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategoryId === null
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Barchasi
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategoryId === category.id
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );
}
