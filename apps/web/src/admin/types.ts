export interface AdminUser {
  id: string;
  username: string;
  role: 'owner' | 'manager' | 'operator';
  is_active: boolean;
  must_change_password: boolean;
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
  tg_users?: {
    tg_id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
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

export interface Category {
  id: string;
  restaurant_id: string;
  title: string;
  sort: number;
  is_active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface AdminUserListItem {
  id: string;
  username: string;
  role: 'owner' | 'manager' | 'operator';
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
}
