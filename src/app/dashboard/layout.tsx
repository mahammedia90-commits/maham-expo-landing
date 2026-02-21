'use client';

import { AuthGuard } from '@/features/auth/components';
import { DashboardLayout } from '@/features/merchant-dashboard/components/DashboardLayout';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
