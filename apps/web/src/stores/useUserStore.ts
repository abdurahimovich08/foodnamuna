import { create } from 'zustand';
import { TelegramUser } from '../types';

interface UserState {
  user: TelegramUser | null;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  setUser: (user: TelegramUser | null) => void;
  setAuthStatus: (status: 'loading' | 'authenticated' | 'unauthenticated') => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  authStatus: 'loading',
  setUser: (user) => set({ user }),
  setAuthStatus: (authStatus) => set({ authStatus }),
}));
