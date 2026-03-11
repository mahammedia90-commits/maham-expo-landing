'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSponsorAuthStore } from '@/shared/store/useSponsorAuthStore';
import { ROUTES } from '@/shared/constants';

interface SponsorAuthGuardProps {
  children: React.ReactNode;
}

export function SponsorAuthGuard({ children }: SponsorAuthGuardProps) {
  const { isAuthenticated, isLoading } = useSponsorAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
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
