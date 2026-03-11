'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useInvestorAuthStore } from '@/shared/store/useInvestorAuthStore';
import { useSponsorAuthStore } from '@/shared/store/useSponsorAuthStore';
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

function getRoleAndRoute(roles: string[]): { role: 'merchant' | 'investor' | 'sponsor'; route: string } {
  if (roles.includes('merchant')) return { role: 'merchant', route: ROUTES.DASHBOARD };
  if (roles.includes('investor')) return { role: 'investor', route: ROUTES.INVESTOR_DASHBOARD };
  if (roles.includes('sponsor')) return { role: 'sponsor', route: ROUTES.SPONSOR_DASHBOARD };
  // Default to merchant if backend returns only "user"
  return { role: 'merchant', route: ROUTES.DASHBOARD };
}

export function useRegister() {
  const merchantStore = useAuthStore();
  const investorStore = useInvestorAuthStore();
  const sponsorStore = useSponsorAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data: AuthResponse) => {
      const roles = data.user.roles || [];
      const { role, route } = getRoleAndRoute(roles);
      const baseUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        avatar: data.user.avatar,
        roles: data.user.roles,
        permissions: data.user.permissions,
        status: data.user.status,
        createdAt: data.user.createdAt,
      };

      if (role === 'investor') {
        investorStore.setAuth({ ...baseUser, role: 'investor' }, data.token);
      } else if (role === 'sponsor') {
        sponsorStore.setAuth({ ...baseUser, role: 'sponsor' }, data.token);
      } else {
        merchantStore.setAuth({ ...baseUser, role: 'merchant' }, data.token);
      }

      router.push(route);
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
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      // Even if API call fails, clear local state
      logout();
      router.push(ROUTES.LOGIN);
    },
  });
}
