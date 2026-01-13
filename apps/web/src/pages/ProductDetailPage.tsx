import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenu } from '../utils/api';
import { ProductWithAddons, ProductAddon, formatPrice } from '@foodnamuna/shared';
import QuantityStepper from '../components/QuantityStepper';
import { useCartStore } from '../stores/useCartStore';
import { StarIcon } from '@heroicons/react/24/solid';

const RESTAURANT_ID = import.meta.env.VITE_RESTAURANT_ID || '00000000-0000-0000-0000-000000000001';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductWithAddons | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const menu = await getMenu(RESTAURANT_ID);
      const allProducts = menu.flatMap((c) => c.products);
      const found = allProducts.find((p) => p.id === id);
      setProduct(found || null);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddonToggle = (addon: ProductAddon) => {
    if (addon.type === 'single') {
      if (selectedAddons.includes(addon.id)) {
        setSelectedAddons([]);
      } else {
        setSelectedAddons([addon.id]);
      }
    } else {
      // multi type
      if (selectedAddons.includes(addon.id)) {
        setSelectedAddons(selectedAddons.filter((id) => id !== addon.id));
      } else {
        const addonCount = selectedAddons.filter((aid) => {
          const a = product?.addons.find((ad) => ad.id === aid);
          return a?.product_id === addon.product_id;
        }).length;
        const maxSelect = addon.max_select || 1;
        if (addonCount < maxSelect) {
          setSelectedAddons([...selectedAddons, addon.id]);
        }
      }
    }
  };

  const calculateTotal = () => {
    if (!product) return 0;
    let total = product.price;
    selectedAddons.forEach((addonId) => {
      const addon = product.addons.find((a) => a.id === addonId);
      if (addon) {
        total += addon.price;
      }
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;

    const selectedAddonObjects = product.addons.filter((a) =>
      selectedAddons.includes(a.id)
    );
    const addonPrice = selectedAddonObjects.reduce((sum, a) => sum + a.price, 0);
    const itemPrice = product.price + addonPrice;

    addItem({
      product_id: product.id,
      title: product.title,
      price: itemPrice,
      image_url: product.image_url,
      selected_addons: selectedAddons,
    });

    // Reset and navigate
    setQuantity(1);
    setSelectedAddons([]);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12 text-gray-500">
        Mahsulot topilmadi
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
        <div className="aspect-video bg-gray-200">
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
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">{product.rating.toFixed(1)}</span>
          <button className="text-sm text-primary ml-2">Sharhlar</button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
        {product.description && (
          <p className="text-gray-600 mb-4">{product.description}</p>
        )}

        {product.addons.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-3">Qo'shimchalar</h3>
            <div className="space-y-2">
              {product.addons.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type={addon.type === 'single' ? 'radio' : 'checkbox'}
                        checked={isSelected}
                        onChange={() => handleAddonToggle(addon)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-medium">{addon.title}</span>
                    </div>
                    {addon.price > 0 && (
                      <span className="text-primary font-semibold">
                        +{formatPrice(addon.price)}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-500">Narxi</span>
              <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
            </div>
            <QuantityStepper
              quantity={quantity}
              onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
              onIncrease={() => setQuantity(quantity + 1)}
            />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.is_active}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Qo'shish
          </button>
        </div>
      </div>
    </div>
  );
}
