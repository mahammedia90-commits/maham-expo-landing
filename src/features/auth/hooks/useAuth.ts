'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { authService } from '../services/authService';
import { ROUTES } from '@/shared/constants';
import type { LoginCredentials, RegisterData, AuthResponse } from '@/shared/types';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      router.push(ROUTES.DASHBOARD);
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      router.push(ROUTES.DASHBOARD);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      router.push(ROUTES.MERCHANT_LOGIN);
    },
    onError: () => {
      // Even if API call fails, clear local state
      logout();
      router.push(ROUTES.MERCHANT_LOGIN);
    },
  });
}
