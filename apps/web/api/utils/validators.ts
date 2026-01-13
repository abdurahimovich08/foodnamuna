// Types for order validation
interface CreateOrderRequest {
  delivery_mode: 'delivery' | 'pickup';
  phone: string;
  address?: string;
  pickup_branch_id?: string;
  comment?: string;
  items: Array<{
    product_id: string;
    title: string;
    price: number;
    qty: number;
    addons?: any[];
    item_comment?: string;
  }>;
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation (Uzbekistan format)
  const phoneRegex = /^\+?998\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateOrderRequest(data: any): data is CreateOrderRequest {
  if (!data || typeof data !== 'object') return false;
  if (data.delivery_mode !== 'delivery' && data.delivery_mode !== 'pickup') return false;
  if (!validatePhone(data.phone)) return false;
  if (data.delivery_mode === 'delivery' && !data.address) return false;
  if (!Array.isArray(data.items) || data.items.length === 0) return false;
  
  return data.items.every((item: any) => 
    item.product_id &&
    item.title &&
    typeof item.price === 'number' &&
    typeof item.qty === 'number' &&
    item.qty > 0
  );
}
