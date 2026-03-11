'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useInvestorAuthStore } from '@/shared/store/useInvestorAuthStore';
import { useSponsorAuthStore } from '@/shared/store/useSponsorAuthStore';
import { authApi } from '@/services/authApi';
import { AUTH_ENDPOINTS, ROUTES } from '@/shared/constants';
import type { LoginCredentials, AuthApiLoginResponse } from '@/shared/types';

function getRoleAndRoute(roles: string[]): { role: 'merchant' | 'investor' | 'sponsor'; route: string } {
  if (roles.includes('merchant')) return { role: 'merchant', route: ROUTES.DASHBOARD };
  if (roles.includes('investor')) return { role: 'investor', route: ROUTES.INVESTOR_DASHBOARD };
  if (roles.includes('sponsor')) return { role: 'sponsor', route: ROUTES.SPONSOR_DASHBOARD };
  // Default to merchant dashboard
  return { role: 'merchant', route: ROUTES.DASHBOARD };
}

export function useUnifiedLogin() {
  const merchantStore = useAuthStore();
  const investorStore = useInvestorAuthStore();
  const sponsorStore = useSponsorAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authApi.post<AuthApiLoginResponse>(AUTH_ENDPOINTS.LOGIN, {
        identifier: credentials.email,
        password: credentials.password,
      });
      return response;
    },
    onSuccess: (response) => {
      const apiUser = response.data.user;
      const token = response.data.token;
      const { role, route } = getRoleAndRoute(apiUser.roles);

      const baseUser = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone || '',
        avatar: apiUser.avatar || undefined,
        roles: apiUser.roles,
        permissions: apiUser.permissions,
        status: apiUser.status,
        createdAt: apiUser.created_at,
      };

      if (role === 'investor') {
        investorStore.setAuth({ ...baseUser, role: 'investor' }, token);
      } else if (role === 'sponsor') {
        sponsorStore.setAuth({ ...baseUser, role: 'sponsor' }, token);
      } else {
        merchantStore.setAuth({ ...baseUser, role: 'merchant' }, token);
      }

      router.push(route);
    },
  });
}
