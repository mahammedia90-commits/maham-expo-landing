'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSponsorAuthStore } from '@/shared/store/useSponsorAuthStore';
import { sponsorAuthService } from '../services/sponsorAuthService';
import { ROUTES } from '@/shared/constants';
import type { LoginCredentials, SponsorAuthResponse } from '@/shared/types';

export function useSponsorLogin() {
  const { setAuth } = useSponsorAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => sponsorAuthService.login(credentials),
    onSuccess: (data: SponsorAuthResponse) => {
      setAuth(data.user, data.token);
      router.push(ROUTES.SPONSOR_DASHBOARD);
    },
  });
}

export function useSponsorLogout() {
  const { logout } = useSponsorAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => sponsorAuthService.logout(),
    onSuccess: () => {
      logout();
      router.push(ROUTES.SPONSOR_LOGIN_PAGE);
    },
    onError: () => {
      logout();
      router.push(ROUTES.SPONSOR_LOGIN_PAGE);
    },
  });
}
