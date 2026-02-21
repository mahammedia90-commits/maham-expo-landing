'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MerchantUser } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthState {
  user: MerchantUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: MerchantUser, token: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user: MerchantUser, token: string) => {
        // Sync token to localStorage for API interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          // Sync token to localStorage on rehydration
          if (state.token && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, state.token);
          }
        }
      },
    }
  )
);
