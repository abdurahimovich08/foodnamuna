import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { formatPrice } from '../utils/validators';
import QuantityStepper from '../components/QuantityStepper';
import ItemCommentModal from '../components/ItemCommentModal';
import { TrashIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    updateItemComment,
    clearCart,
    getTotal,
  } = useCartStore();
  const [commentModalItem, setCommentModalItem] = useState<{
    productId: string;
    selectedAddons: string[];
  } | null>(null);

  const handleQuantityChange = (
    productId: string,
    selectedAddons: string[],
    newQty: number
  ) => {
    updateQuantity(productId, selectedAddons, newQty);
  };

  const handleCommentSave = (comment: string) => {
    if (commentModalItem) {
      updateItemComment(
        commentModalItem.productId,
        commentModalItem.selectedAddons,
        comment
      );
    }
    setCommentModalItem(null);
  };

  const getItemComment = (productId: string, selectedAddons: string[]) => {
    const item = items.find(
      (i) =>
        i.product_id === productId &&
        JSON.stringify(i.selected_addons.sort()) ===
          JSON.stringify(selectedAddons.sort())
    );
    return item?.item_comment || '';
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Savat bo'sh</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Mahsulotlar sahifasiga o'tish
        </button>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Savat</h2>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <TrashIcon className="w-4 h-4" />
          Tozalash
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const itemKey = `${item.product_id}_${item.selected_addons.join(',')}`;
          const comment = getItemComment(item.product_id, item.selected_addons);

          return (
            <div
              key={itemKey}
              className="bg-white rounded-lg p-4 shadow-sm flex gap-3"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                <p className="text-primary font-semibold mb-2">
                  {formatPrice(item.price * item.qty)}
                </p>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    quantity={item.qty}
                    onDecrease={() =>
                      handleQuantityChange(item.product_id, item.selected_addons, item.qty - 1)
                    }
                    onIncrease={() =>
                      handleQuantityChange(item.product_id, item.selected_addons, item.qty + 1)
                    }
                  />
                  <button
                    onClick={() =>
                      setCommentModalItem({
                        productId: item.product_id,
                        selectedAddons: item.selected_addons,
                      })
                    }
                    className="text-sm text-gray-600 hover:text-primary flex items-center gap-1"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {comment ? 'Tahrirlash' : 'Fikr qoldiring'}
                  </button>
                </div>
                {comment && (
                  <p className="text-xs text-gray-500 mt-1 italic">"{comment}"</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-20 bg-white border-t border-gray-200 p-4 rounded-t-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm text-gray-500">Jami</span>
            <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Keyingi
        </button>
      </div>

      {commentModalItem && (
        <ItemCommentModal
          isOpen={true}
          onClose={() => setCommentModalItem(null)}
          initialComment={getItemComment(
            commentModalItem.productId,
            commentModalItem.selectedAddons
          )}
          onSave={handleCommentSave}
        />
      )}
    </div>
  );
}
