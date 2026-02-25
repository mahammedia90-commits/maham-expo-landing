'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SponsorUser } from '../types';
import { STORAGE_KEYS } from '../constants';

interface SponsorAuthState {
  user: SponsorUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: SponsorUser, token: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useSponsorAuthStore = create<SponsorAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user: SponsorUser, token: string) => {
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
      name: STORAGE_KEYS.SPONSOR_AUTH_STORE,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          if (state.token && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, state.token);
          }
        }
      },
    }
  )
);
