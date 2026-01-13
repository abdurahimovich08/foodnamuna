import { CategoryWithProducts, CreateOrderRequest, Order, OrderWithItems, Branch } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export async function getMenu(restaurantId: string): Promise<CategoryWithProducts[]> {
  return fetchAPI<CategoryWithProducts[]>(`/api/menu?restaurant_id=${restaurantId}`);
}

export async function createOrder(order: CreateOrderRequest, initData: string): Promise<Order> {
  return fetchAPI<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ ...order, initData }),
  });
}

export async function getOrders(initData: string): Promise<Order[]> {
  return fetchAPI<Order[]>(`/api/orders?initData=${encodeURIComponent(initData)}`);
}

export async function getOrder(id: string, initData: string): Promise<OrderWithItems> {
  return fetchAPI<OrderWithItems>(`/api/orders?id=${id}&initData=${encodeURIComponent(initData)}`);
}

export async function getBranches(restaurantId: string): Promise<Branch[]> {
  return fetchAPI<Branch[]>(`/api/branches?restaurant_id=${restaurantId}`);
}
