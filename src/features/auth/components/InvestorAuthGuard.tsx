'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvestorAuthStore } from '@/shared/store/useInvestorAuthStore';
import { ROUTES } from '@/shared/constants';

interface InvestorAuthGuardProps {
  children: React.ReactNode;
}

export function InvestorAuthGuard({ children }: InvestorAuthGuardProps) {
  const { isAuthenticated, isLoading } = useInvestorAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.INVESTOR_LOGIN_PAGE);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#987012] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
