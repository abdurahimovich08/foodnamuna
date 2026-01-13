import { create } from 'zustand';
import { adminAuthAPI } from '../api/adminClient';
import type { AdminUser } from '../types';

interface AdminAuthState {
  admin: AdminUser | null;
  loading: boolean;
  initialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  admin: null,
  loading: false,
  initialized: false,

  login: async (username: string, password: string) => {
    set({ loading: true });
    try {
      const response = await adminAuthAPI.login(username, password);
      set({
        admin: {
          id: response.admin.id,
          username: response.admin.username,
          role: response.admin.role,
          is_active: true,
          must_change_password: response.admin.must_change_password,
        },
        loading: false,
        initialized: true,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await adminAuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        admin: null,
        initialized: true,
      });
    }
  },

  checkAuth: async () => {
    if (get().initialized) return;
    
    set({ loading: true });
    try {
      const response = await adminAuthAPI.me();
      set({
        admin: {
          id: response.admin.id,
          username: response.admin.username,
          role: response.admin.role,
          is_active: true,
          must_change_password: response.admin.must_change_password,
        },
        loading: false,
        initialized: true,
      });
    } catch (error) {
      set({
        admin: null,
        loading: false,
        initialized: true,
      });
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ loading: true });
    try {
      await adminAuthAPI.changePassword(currentPassword, newPassword);
      // Refetch admin to update must_change_password
      await get().checkAuth();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
