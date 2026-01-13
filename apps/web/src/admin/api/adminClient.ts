import type { Order, OrderWithItems, Category, Product, AdminUserListItem } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Important for httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: `Request failed: ${response.statusText}` 
    }));
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
}

// Auth
export const adminAuthAPI = {
  login: async (username: string, password: string) => {
    return fetchAPI<{
      admin: {
        id: string;
        username: string;
        role: 'owner' | 'manager' | 'operator';
        must_change_password: boolean;
      };
      token: string;
    }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  logout: async () => {
    return fetchAPI<{ message: string }>('/api/admin/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return fetchAPI<{
      admin: {
        id: string;
        username: string;
        role: 'owner' | 'manager' | 'operator';
        must_change_password: boolean;
      };
    }>('/api/admin/me');
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return fetchAPI<{ message: string }>('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },
};

// Orders
export const adminOrdersAPI = {
  list: async (status?: string) => {
    const url = status 
      ? `/api/admin/orders?status=${status}`
      : '/api/admin/orders';
    return fetchAPI<Order[]>(url);
  },

  get: async (id: string) => {
    return fetchAPI<OrderWithItems>(`/api/admin/orders/${id}`);
  },

  updateStatus: async (id: string, toStatus: string) => {
    return fetchAPI<{
      message: string;
      order_id: string;
      from_status: string;
      to_status: string;
    }>(`/api/admin/orders/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ to_status: toStatus }),
    });
  },
};

// Categories
export const adminCategoriesAPI = {
  list: async () => {
    return fetchAPI<Category[]>('/api/admin/categories');
  },

  get: async (id: string) => {
    return fetchAPI<Category>(`/api/admin/categories/${id}`);
  },

  create: async (data: {
    title: string;
    sort?: number;
    is_active?: boolean;
    image_url?: string;
  }) => {
    return fetchAPI<Category>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: {
    title?: string;
    sort?: number;
    is_active?: boolean;
    image_url?: string;
  }) => {
    return fetchAPI<Category>(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<{ message: string }>(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Products
export const adminProductsAPI = {
  list: async (categoryId?: string) => {
    const url = categoryId
      ? `/api/admin/products?category_id=${categoryId}`
      : '/api/admin/products';
    return fetchAPI<Product[]>(url);
  },

  get: async (id: string) => {
    return fetchAPI<Product>(`/api/admin/products/${id}`);
  },

  create: async (data: {
    title: string;
    description?: string;
    price: number;
    category_id: string;
    image_url?: string;
    is_active?: boolean;
    sort?: number;
    tags?: string[];
  }) => {
    return fetchAPI<Product>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: {
    title?: string;
    description?: string;
    price?: number;
    category_id?: string;
    image_url?: string;
    is_active?: boolean;
    sort?: number;
    tags?: string[];
  }) => {
    return fetchAPI<Product>(`/api/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<{ message: string }>(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin Users
export const adminUsersAPI = {
  list: async () => {
    return fetchAPI<AdminUserListItem[]>('/api/admin/admin-users');
  },

  create: async (data: {
    username: string;
    password: string;
    role: 'owner' | 'manager' | 'operator';
  }) => {
    return fetchAPI<AdminUserListItem>('/api/admin/admin-users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: {
    role?: 'owner' | 'manager' | 'operator';
    is_active?: boolean;
  }) => {
    return fetchAPI<AdminUserListItem>(`/api/admin/admin-users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (id: string, newPassword: string) => {
    return fetchAPI<{ message: string }>(`/api/admin/admin-users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    });
  },
};
