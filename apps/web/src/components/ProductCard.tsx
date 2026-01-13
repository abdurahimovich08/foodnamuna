import { useNavigate } from 'react-router-dom';
import { ProductWithAddons } from '@foodnamuna/shared';
import { formatPrice } from '@foodnamuna/shared';

interface ProductCardProps {
  product: ProductWithAddons;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  if (!product.is_active) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm opacity-60">
        <div className="aspect-square bg-gray-200 relative">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Mavjud emas</span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 mb-1">{product.title}</h3>
          <p className="text-primary font-semibold">{formatPrice(product.price)}</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="aspect-square bg-gray-200">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Rasm yo'q
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.title}</h3>
        <p className="text-primary font-semibold">{formatPrice(product.price)}</p>
      </div>
    </button>
  );
}
