export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  phone?: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  restaurant_id: string;
  title: string;
  sort: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  restaurant_id: string;
  category_id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  sort: number;
  tags: string[];
  rating: number;
}

export interface ProductAddon {
  id: string;
  product_id: string;
  title: string;
  price: number;
  type: 'single' | 'multi';
  max_select: number;
  is_active: boolean;
  sort: number;
}

export interface ProductWithAddons extends Product {
  addons: ProductAddon[];
}

export interface CategoryWithProducts extends Category {
  products: ProductWithAddons[];
}

export interface TelegramUser {
  tg_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface CartItem {
  product_id: string;
  title: string;
  price: number;
  image_url?: string;
  qty: number;
  selected_addons: string[]; // Addon IDs
  item_comment?: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  tg_id: number;
  status: 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  delivery_mode: 'delivery' | 'pickup';
  phone: string;
  address?: string;
  pickup_branch_id?: string;
  comment?: string;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  title: string;
  price: number;
  qty: number;
  addons_json: any;
  item_comment?: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface Branch {
  id: string;
  restaurant_id: string;
  title: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  is_active: boolean;
}

export interface CreateOrderRequest {
  delivery_mode: 'delivery' | 'pickup';
  phone: string;
  address?: string;
  pickup_branch_id?: string;
  comment?: string;
  items: CartItem[];
}

export interface TelegramInitData {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
  };
  auth_date: number;
  hash: string;
}
