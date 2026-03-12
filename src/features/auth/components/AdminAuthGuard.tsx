'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { ROUTES } from '@/shared/constants';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();

  const hasAdminAccess = user?.roles?.some(r => ['super-admin', 'admin', 'supervisor'].includes(r));

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    } else if (!isLoading && isAuthenticated && !hasAdminAccess) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, hasAdminAccess, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#987012] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasAdminAccess) {
    return null;
  }

  return <>{children}</>;
}
