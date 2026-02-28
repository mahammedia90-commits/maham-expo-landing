'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useInvestorAuthStore } from '@/shared/store/useInvestorAuthStore';
import { investorAuthService } from '../services/investorAuthService';
import { ROUTES } from '@/shared/constants';
import type { LoginCredentials, InvestorAuthResponse } from '@/shared/types';

export function useInvestorLogin() {
  const { setAuth } = useInvestorAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => investorAuthService.login(credentials),
    onSuccess: (data: InvestorAuthResponse) => {
      setAuth(data.user, data.token);
      router.push(ROUTES.INVESTOR_DASHBOARD);
    },
  });
}

export function useInvestorLogout() {
  const { logout } = useInvestorAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => investorAuthService.logout(),
    onSuccess: () => {
      logout();
      router.push(ROUTES.INVESTOR_LOGIN_PAGE);
    },
    onError: () => {
      logout();
      router.push(ROUTES.INVESTOR_LOGIN_PAGE);
    },
  });
}
